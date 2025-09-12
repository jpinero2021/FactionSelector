import { type User, type InsertUser, type FactionRegistration, type InsertFactionRegistration, type DbFactionRegistration, type InsertDbFactionRegistration, users, factionRegistrations } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getFactionRegistrations(): Promise<FactionRegistration[]> {
    const registrations = await db.select().from(factionRegistrations);
    return registrations.map(this.mapDbToFactionRegistration);
  }

  async createFactionRegistration(registration: InsertFactionRegistration): Promise<FactionRegistration> {
    // Check if a registration with this playerName already exists (case-insensitive, trimmed)
    const normalizedNewName = this.normalizePlayerName(registration.playerName);
    const existingRegistrations = await db.select().from(factionRegistrations);
    const existingRegistration = existingRegistrations.find(reg => 
      this.normalizePlayerName(reg.playerName) === normalizedNewName
    );
    
    if (existingRegistration) {
      throw new Error('DUPLICATE_PLAYER');
    }
    
    const insertData = {
      faction: registration.faction,
      playerName: registration.playerName,
      characterUuid: registration.characterUuid || null,
      teamName: registration.teamName || null,
      ownerSecret: randomUUID(),
    };

    const [newRegistration] = await db
      .insert(factionRegistrations)
      .values(insertData)
      .returning();
    
    return this.mapDbToFactionRegistration(newRegistration);
  }

  async getRegistrationsByFaction(faction: "efemeros" | "rosetta"): Promise<FactionRegistration[]> {
    const registrations = await db.select().from(factionRegistrations).where(eq(factionRegistrations.faction, faction));
    return registrations.map(this.mapDbToFactionRegistration);
  }

  async getRegistrationById(id: string): Promise<FactionRegistration | undefined> {
    const [registration] = await db.select().from(factionRegistrations).where(eq(factionRegistrations.id, id));
    return registration ? this.mapDbToFactionRegistration(registration) : undefined;
  }

  async getRegistrationByPlayerName(playerName: string): Promise<FactionRegistration | undefined> {
    const [registration] = await db.select().from(factionRegistrations).where(eq(factionRegistrations.playerName, playerName));
    return registration ? this.mapDbToFactionRegistration(registration) : undefined;
  }

  async updateRegistrationFaction(id: string, newFaction: "efemeros" | "rosetta", ownerSecret: string): Promise<FactionRegistration | null> {
    const [registration] = await db.select().from(factionRegistrations).where(eq(factionRegistrations.id, id));
    
    if (!registration) {
      return null; // Registration not found
    }

    // Validate owner secret
    if (registration.ownerSecret !== ownerSecret) {
      throw new Error('UNAUTHORIZED');
    }

    // Update the faction
    const [updatedRegistration] = await db
      .update(factionRegistrations)
      .set({ faction: newFaction })
      .where(eq(factionRegistrations.id, id))
      .returning();
    
    return this.mapDbToFactionRegistration(updatedRegistration);
  }

  async deleteRegistration(id: string, ownerSecret: string): Promise<boolean> {
    const [registration] = await db.select().from(factionRegistrations).where(eq(factionRegistrations.id, id));
    
    if (!registration) {
      return false; // Registration not found
    }

    // Validate owner secret
    if (registration.ownerSecret !== ownerSecret) {
      throw new Error('UNAUTHORIZED');
    }

    // Remove the registration
    await db.delete(factionRegistrations).where(eq(factionRegistrations.id, id));
    
    return true;
  }

  async updateRegistration(id: string, data: Partial<FactionRegistration>, ownerSecret: string): Promise<FactionRegistration | null> {
    const [registration] = await db.select().from(factionRegistrations).where(eq(factionRegistrations.id, id));
    
    if (!registration) {
      return null; // Registration not found
    }

    // Validate owner secret
    if (registration.ownerSecret !== ownerSecret) {
      throw new Error('UNAUTHORIZED');
    }

    // Check for duplicate playerName if it's being changed
    if (data.playerName && data.playerName !== registration.playerName) {
      const normalizedNewName = this.normalizePlayerName(data.playerName);
      const existingRegistrations = await db.select().from(factionRegistrations);
      const existingRegistration = existingRegistrations.find(reg => 
        reg.id !== id && this.normalizePlayerName(reg.playerName) === normalizedNewName
      );
      if (existingRegistration) {
        throw new Error('DUPLICATE_PLAYER');
      }
    }

    // Update allowed fields (don't allow changing id, registeredAt, ownerSecret)
    const updateData: Partial<DbFactionRegistration> = {};
    if (data.playerName !== undefined) updateData.playerName = data.playerName;
    if (data.teamName !== undefined) updateData.teamName = data.teamName;
    if (data.characterUuid !== undefined) updateData.characterUuid = data.characterUuid;
    if (data.faction !== undefined) updateData.faction = data.faction;

    const [updatedRegistration] = await db
      .update(factionRegistrations)
      .set(updateData)
      .where(eq(factionRegistrations.id, id))
      .returning();
    
    return this.mapDbToFactionRegistration(updatedRegistration);
  }

  async validateOwnerSecret(id: string, ownerSecret: string): Promise<boolean> {
    const [registration] = await db.select().from(factionRegistrations).where(eq(factionRegistrations.id, id));
    
    if (!registration) {
      return false; // Registration not found
    }

    return registration.ownerSecret === ownerSecret;
  }

  private normalizePlayerName(name: string): string {
    return name.trim().toLowerCase();
  }

  private mapDbToFactionRegistration(dbReg: DbFactionRegistration): FactionRegistration {
    return {
      id: dbReg.id,
      faction: dbReg.faction as "efemeros" | "rosetta",
      playerName: dbReg.playerName,
      characterUuid: dbReg.characterUuid || undefined,
      teamName: dbReg.teamName || undefined,
      registeredAt: dbReg.registeredAt,
      ownerSecret: dbReg.ownerSecret,
    };
  }
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
