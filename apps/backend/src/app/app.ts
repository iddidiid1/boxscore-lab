import cors from "cors";
import express from "express";
import { config } from "../config/index.js";
import { registerRoutes } from "./routes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.frontendOrigin }));
  app.use(express.json());

  registerRoutes(app);

  return app;
}
