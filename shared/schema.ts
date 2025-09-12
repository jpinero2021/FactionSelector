import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  teamName: text("team_name").notNull(),
  energyPoints: integer("energy_points").notNull(),
  category: text("category").notNull(), // "efemeros" or "rosetta"
  rank: integer("rank").notNull(),
});

export const factionRegistrations = pgTable("faction_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  faction: text("faction").notNull(), // "efemeros" or "rosetta"
  playerName: text("player_name").notNull().unique(),
  characterUuid: text("character_uuid"),
  teamName: text("team_name"),
  registeredAt: text("registered_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  ownerSecret: text("owner_secret").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).pick({
  playerName: true,
  teamName: true,
  energyPoints: true,
  category: true,
  rank: true,
});

export const insertFactionRegistrationSchema = createInsertSchema(factionRegistrations).omit({
  id: true,
  registeredAt: true,
});

export const insertFactionRegistrationNoSecretSchema = createInsertSchema(factionRegistrations).omit({
  id: true,
  registeredAt: true,
  ownerSecret: true,
});

// Registro de facción schema
export const factionRegistrationSchema = z.object({
  id: z.string().optional(),
  faction: z.enum(["efemeros", "rosetta"]),
  playerName: z.string().min(1, "El nombre es requerido"),
  characterUuid: z.union([z.string(), z.number()]).transform(v => String(v)).optional(),
  teamName: z.string().optional(),
  registeredAt: z.string().optional(),
  ownerSecret: z.string().optional(),
});

// Update registration schema for editing existing registrations
export const updateRegistrationSchema = z.object({
  playerName: z.string().min(1, "El nombre es requerido").optional(),
  teamName: z.string().optional(),
  characterUuid: z.union([z.string(), z.number()]).transform(v => String(v)).optional(),
  faction: z.enum(["efemeros", "rosetta"]).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type DbFactionRegistration = typeof factionRegistrations.$inferSelect;
export type InsertDbFactionRegistration = z.infer<typeof insertFactionRegistrationSchema>;
export type FactionRegistration = z.infer<typeof factionRegistrationSchema>;
export type InsertFactionRegistration = Omit<FactionRegistration, 'id' | 'registeredAt' | 'ownerSecret'>;