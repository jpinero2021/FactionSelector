import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { factionRegistrationSchema, updateRegistrationSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { validateAdminPassword, generateAdminToken, validateAdminToken, initializeAdminAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Get all faction registrations
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getFactionRegistrations();
      // Sanitize response: remove ownerSecret for security
      const sanitizedRegistrations = registrations.map(({ ownerSecret, ...reg }) => reg);
      res.json(sanitizedRegistrations);
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
      // Sanitize response: remove ownerSecret for security
      const sanitizedRegistrations = registrations.map(({ ownerSecret, ...reg }) => reg);
      res.json(sanitizedRegistrations);
    } catch (error) {
      res.status(500).json({ error: "Error fetching registrations" });
    }
  });

  // Create new faction registration
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = factionRegistrationSchema.parse(req.body);
      const { id, registeredAt, ownerSecret, ...insertData } = validatedData;
      
      const registration = await storage.createFactionRegistration(insertData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid registration data", details: error.errors });
      }
      if (error instanceof Error && error.message === 'DUPLICATE_PLAYER') {
        return res.status(409).json({ error: "A player with this name is already registered" });
      }
      res.status(500).json({ error: "Error creating registration" });
    }
  });

  // Update registration faction
  const updateFactionSchema = z.object({
    faction: z.enum(["efemeros", "rosetta"])
  });

  app.put("/api/registrations/:id/faction", async (req, res) => {
    try {
      const { id } = req.params;
      const { faction } = updateFactionSchema.parse(req.body);
      
      // Extract ownerSecret from headers
      const ownerSecret = req.headers['x-registration-secret'] as string;
      
      if (!ownerSecret) {
        return res.status(403).json({ error: "Registration secret required" });
      }
      
      const updatedRegistration = await storage.updateRegistrationFaction(id, faction, ownerSecret);
      
      if (!updatedRegistration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      // Sanitize response: remove ownerSecret for security
      const { ownerSecret: _, ...sanitizedRegistration } = updatedRegistration;
      res.json(sanitizedRegistration);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid faction", details: error.errors });
      }
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: "You are not authorized to modify this registration" });
      }
      res.status(500).json({ error: "Error updating registration faction" });
    }
  });

  // Update registration
  app.put("/api/registrations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = updateRegistrationSchema.parse(req.body);
      
      // Extract ownerSecret from headers
      const ownerSecret = req.headers['x-registration-secret'] as string;
      
      if (!ownerSecret) {
        return res.status(403).json({ error: "Registration secret required" });
      }
      
      const updatedRegistration = await storage.updateRegistration(id, updateData, ownerSecret);
      
      if (!updatedRegistration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      // Sanitize response: remove ownerSecret for security
      const { ownerSecret: _, ...sanitizedRegistration } = updatedRegistration;
      res.json(sanitizedRegistration);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: "You are not authorized to modify this registration" });
      }
      if (error instanceof Error && error.message === 'DUPLICATE_PLAYER') {
        return res.status(409).json({ error: "A player with this name is already registered" });
      }
      res.status(500).json({ error: "Error updating registration" });
    }
  });

  // Delete registration
  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Extract ownerSecret from headers
      const ownerSecret = req.headers['x-registration-secret'] as string;
      
      if (!ownerSecret) {
        return res.status(403).json({ error: "Registration secret required" });
      }
      
      const deleted = await storage.deleteRegistration(id, ownerSecret);
      
      if (!deleted) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: "You are not authorized to delete this registration" });
      }
      res.status(500).json({ error: "Error deleting registration" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }
      
      const isValid = await validateAdminPassword(password);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid admin password" });
      }
      
      const token = generateAdminToken();
      res.json({ success: true, token });
    } catch (error) {
      res.status(500).json({ error: "Error validating admin credentials" });
    }
  });

  // Validate admin token
  app.get("/api/admin/validate", async (req, res) => {
    try {
      const token = req.headers['authorization']?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: "Token required" });
      }
      
      const isValid = validateAdminToken(token);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid token" });
      }
      
      res.json({ valid: true });
    } catch (error) {
      res.status(500).json({ error: "Error validating token" });
    }
  });

  // Initialize admin auth on startup
  await initializeAdminAuth();

  const httpServer = createServer(app);

  return httpServer;
}
