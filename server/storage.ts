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

  async createFactionRegistration(registration: InsertFactionRegistration): Promise<FactionRegistration> {
    const registrations = await this.getFactionRegistrations();
    
    const newRegistration: FactionRegistration = {
      id: randomUUID(),
      ...registration,
      registeredAt: new Date().toISOString(),
    };

    registrations.push(newRegistration);
    
    await fs.writeFile(REGISTROS_FILE, JSON.stringify(registrations, null, 2));
    
    return newRegistration;
  }

  async getRegistrationsByFaction(faction: "efemeros" | "rosetta"): Promise<FactionRegistration[]> {
    const registrations = await this.getFactionRegistrations();
    return registrations.filter(reg => reg.faction === faction);
  }
}

export const storage = new MemStorage();
