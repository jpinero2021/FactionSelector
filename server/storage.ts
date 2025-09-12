import { type User, type InsertUser, type FactionRegistration, type InsertFactionRegistration } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const REGISTROS_FILE = path.join(process.cwd(), "registros.json");

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Faction registration methods
  getFactionRegistrations(): Promise<FactionRegistration[]>;
  createFactionRegistration(registration: InsertFactionRegistration): Promise<FactionRegistration>;
  getRegistrationsByFaction(faction: "efemeros" | "rosetta"): Promise<FactionRegistration[]>;
  getRegistrationById(id: string): Promise<FactionRegistration | undefined>;
  getRegistrationByPlayerName(playerName: string): Promise<FactionRegistration | undefined>;
  updateRegistration(id: string, data: Partial<FactionRegistration>, ownerSecret: string): Promise<FactionRegistration | null>;
  updateRegistrationFaction(id: string, newFaction: "efemeros" | "rosetta", ownerSecret: string): Promise<FactionRegistration | null>;
  deleteRegistration(id: string, ownerSecret: string): Promise<boolean>;
  validateOwnerSecret(id: string, ownerSecret: string): Promise<boolean>;
}


export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFactionRegistrations(): Promise<FactionRegistration[]> {
    try {
      const data = await fs.readFile(REGISTROS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  // Helper function to normalize player names for comparison
  private normalizePlayerName(name: string): string {
    return name.trim().toLowerCase();
  }

  async createFactionRegistration(registration: InsertFactionRegistration): Promise<FactionRegistration> {
    const registrations = await this.getFactionRegistrations();
    
    // Check if a registration with this playerName already exists (case-insensitive, trimmed)
    const normalizedNewName = this.normalizePlayerName(registration.playerName);
    const existingRegistration = registrations.find(reg => 
      this.normalizePlayerName(reg.playerName) === normalizedNewName
    );
    if (existingRegistration) {
      throw new Error('DUPLICATE_PLAYER');
    }
    
    const newRegistration: FactionRegistration = {
      id: randomUUID(),
      ...registration,
      registeredAt: new Date().toISOString(),
      ownerSecret: randomUUID(), // Generate unique ownerSecret
    };

    registrations.push(newRegistration);
    
    await fs.writeFile(REGISTROS_FILE, JSON.stringify(registrations, null, 2));
    
    return newRegistration;
  }

  async getRegistrationsByFaction(faction: "efemeros" | "rosetta"): Promise<FactionRegistration[]> {
    const registrations = await this.getFactionRegistrations();
    return registrations.filter(reg => reg.faction === faction);
  }

  async getRegistrationById(id: string): Promise<FactionRegistration | undefined> {
    const registrations = await this.getFactionRegistrations();
    return registrations.find(reg => reg.id === id);
  }

  async getRegistrationByPlayerName(playerName: string): Promise<FactionRegistration | undefined> {
    const registrations = await this.getFactionRegistrations();
    return registrations.find(reg => reg.playerName === playerName);
  }

  async updateRegistrationFaction(id: string, newFaction: "efemeros" | "rosetta", ownerSecret: string): Promise<FactionRegistration | null> {
    const registrations = await this.getFactionRegistrations();
    const registrationIndex = registrations.findIndex(reg => reg.id === id);
    
    if (registrationIndex === -1) {
      return null; // Registration not found
    }

    // Validate owner secret
    if (registrations[registrationIndex].ownerSecret !== ownerSecret) {
      throw new Error('UNAUTHORIZED'); // Will be caught in routes to return 403
    }

    // Update the faction
    registrations[registrationIndex].faction = newFaction;
    
    // Save to file
    await fs.writeFile(REGISTROS_FILE, JSON.stringify(registrations, null, 2));
    
    return registrations[registrationIndex];
  }

  async deleteRegistration(id: string, ownerSecret: string): Promise<boolean> {
    const registrations = await this.getFactionRegistrations();
    const registrationIndex = registrations.findIndex(reg => reg.id === id);
    
    if (registrationIndex === -1) {
      return false; // Registration not found
    }

    // Validate owner secret
    if (registrations[registrationIndex].ownerSecret !== ownerSecret) {
      throw new Error('UNAUTHORIZED'); // Will be caught in routes to return 403
    }

    // Remove the registration
    const filteredRegistrations = registrations.filter(reg => reg.id !== id);
    
    // Save the filtered registrations back to file
    await fs.writeFile(REGISTROS_FILE, JSON.stringify(filteredRegistrations, null, 2));
    
    return true;
  }

  async updateRegistration(id: string, data: Partial<FactionRegistration>, ownerSecret: string): Promise<FactionRegistration | null> {
    const registrations = await this.getFactionRegistrations();
    const registrationIndex = registrations.findIndex(reg => reg.id === id);
    
    if (registrationIndex === -1) {
      return null; // Registration not found
    }

    // Validate owner secret
    if (registrations[registrationIndex].ownerSecret !== ownerSecret) {
      throw new Error('UNAUTHORIZED'); // Will be caught in routes to return 403
    }

    // Check for duplicate playerName if it's being changed
    if (data.playerName && data.playerName !== registrations[registrationIndex].playerName) {
      const normalizedNewName = this.normalizePlayerName(data.playerName);
      const existingRegistration = registrations.find(reg => 
        reg.id !== id && this.normalizePlayerName(reg.playerName) === normalizedNewName
      );
      if (existingRegistration) {
        throw new Error('DUPLICATE_PLAYER');
      }
    }

    // Update allowed fields (don't allow changing id, registeredAt, ownerSecret)
    const { id: _, registeredAt, ownerSecret: __, ...allowedData } = data;
    Object.assign(registrations[registrationIndex], allowedData);
    
    // Save to file
    await fs.writeFile(REGISTROS_FILE, JSON.stringify(registrations, null, 2));
    
    return registrations[registrationIndex];
  }

  async validateOwnerSecret(id: string, ownerSecret: string): Promise<boolean> {
    const registrations = await this.getFactionRegistrations();
    const registration = registrations.find(reg => reg.id === id);
    
    if (!registration) {
      return false; // Registration not found
    }

    return registration.ownerSecret === ownerSecret;
  }
}

export const storage = new MemStorage();
