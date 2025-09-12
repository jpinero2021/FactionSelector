import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { factionRegistrationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Get all faction registrations
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getFactionRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Error fetching registrations" });
    }
  });

  // Get registrations by faction
  app.get("/api/registrations/:faction", async (req, res) => {
    try {
      const faction = req.params.faction as "efemeros" | "rosetta";
      if (!["efemeros", "rosetta"].includes(faction)) {
        return res.status(400).json({ error: "Invalid faction" });
      }
      
      const registrations = await storage.getRegistrationsByFaction(faction);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Error fetching registrations" });
    }
  });

  // Create new faction registration
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = factionRegistrationSchema.parse(req.body);
      const { id, registeredAt, ...insertData } = validatedData;
      
      const registration = await storage.createFactionRegistration(insertData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid registration data", details: error });
      }
      res.status(500).json({ error: "Error creating registration" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
