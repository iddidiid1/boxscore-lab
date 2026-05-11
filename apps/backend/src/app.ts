import cors from "cors";
import express from "express";
import healthRoutes from "./routes/health.routes.js";

export function createApp() {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json());

  app.use("/api/health", healthRoutes);

  return app;
}
