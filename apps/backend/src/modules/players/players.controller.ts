import type { Request, Response } from "express";
import { sendError } from "../../shared/errors/api-error.js";
import { getPlayerDetail, listPlayers } from "./players.service.js";
import { parsePlayerDetailQuery, parsePlayerListQuery, parsePlayerSlug } from "./players.validation.js";

export async function listPlayersHandler(req: Request, res: Response) {
  try { res.json(await listPlayers(parsePlayerListQuery(req.query))); } catch (error) { sendError(res, error); }
}
export async function getPlayerHandler(req: Request, res: Response) {
  try { res.json(await getPlayerDetail(parsePlayerSlug(req.params.slug), parsePlayerDetailQuery(req.query))); } catch (error) { sendError(res, error); }
}
