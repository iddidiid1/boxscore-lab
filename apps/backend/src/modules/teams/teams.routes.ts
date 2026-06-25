import { Router } from "express";
import { archiveTeam, createTeam, getTeam, listTeams, updateTeam } from "./teams.controller.js";

export const teamsRoutes = Router();

teamsRoutes.get("/", listTeams);
teamsRoutes.post("/", createTeam);
teamsRoutes.get("/:slug", getTeam);
teamsRoutes.patch("/:slug", updateTeam);
teamsRoutes.post("/:slug/archive", archiveTeam);

