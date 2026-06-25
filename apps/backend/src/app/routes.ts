import type { Express } from "express";
import { divisionsRoutes } from "../modules/divisions/index.js";
import { healthRoutes } from "../modules/health/index.js";
import { teamsRoutes } from "../modules/teams/index.js";

export function registerRoutes(app: Express) {
  app.use("/api/divisions", divisionsRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/teams", teamsRoutes);
}
