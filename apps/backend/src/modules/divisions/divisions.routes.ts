import { Router } from "express";
import { getDivisions } from "./divisions.controller.js";

export const divisionsRoutes = Router();

divisionsRoutes.get("/", getDivisions);

