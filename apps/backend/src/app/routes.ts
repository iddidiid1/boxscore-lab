import type { Express } from "express";
import { divisionsRoutes } from "../modules/divisions/index.js";
import { healthRoutes } from "../modules/health/index.js";
import { eventsRoutes } from "../modules/events/index.js";
import { matchesRoutes } from "../modules/matches/index.js";
import { teamsRoutes } from "../modules/teams/index.js";
import { playersRoutes } from "../modules/players/index.js";

export function registerRoutes(app: Express) {
  app.use("/api/divisions", divisionsRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/events", eventsRoutes);
  app.use("/api/matches", matchesRoutes);
  app.use("/api/teams", teamsRoutes);
  app.use("/api/players", playersRoutes);
}
