import { Router } from "express";
import { getPlayerHandler, listPlayersHandler } from "./players.controller.js";
export const playersRoutes = Router();
playersRoutes.get("/", listPlayersHandler);
playersRoutes.get("/:slug", getPlayerHandler);
