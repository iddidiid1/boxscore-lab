import type { Request, Response } from "express";
import { sendError } from "../../shared/errors/api-error.js";
import { listDivisions } from "./divisions.service.js";

export async function getDivisions(_req: Request, res: Response) {
  try {
    res.json({ divisions: await listDivisions() });
  } catch (error) {
    sendError(res, error);
  }
}

