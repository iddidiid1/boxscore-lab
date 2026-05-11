import type { Express } from "express";
import { healthRoutes } from "../modules/health/index.js";

export function registerRoutes(app: Express) {
  app.use("/api/health", healthRoutes);
}
