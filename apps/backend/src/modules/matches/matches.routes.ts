import { Router } from "express";
import {
  createMatchHandler,
  getFormOptionsHandler,
  getMatchHandler,
  listMatchesHandler,
  restoreMatchHandler,
  updateMatchHandler,
  voidMatchHandler
} from "./matches.controller.js";

export const matchesRoutes = Router();

matchesRoutes.get("/", listMatchesHandler);
matchesRoutes.get("/form-options", getFormOptionsHandler);
matchesRoutes.post("/", createMatchHandler);
matchesRoutes.get("/:id", getMatchHandler);
matchesRoutes.patch("/:id", updateMatchHandler);
matchesRoutes.post("/:id/void", voidMatchHandler);
matchesRoutes.post("/:id/restore", restoreMatchHandler);
