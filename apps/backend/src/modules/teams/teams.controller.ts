import type { Request, Response } from "express";
import { sendError } from "../../shared/errors/api-error.js";
import {
  archiveTeamBySlug,
  createTeamWithRoster,
  getTeamBySlug,
  getTeamsGroupedByDivision,
  updateTeamWithRoster
} from "./teams.service.js";

function getSlugParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export async function listTeams(_req: Request, res: Response) {
  try {
    res.json(await getTeamsGroupedByDivision());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getTeam(req: Request, res: Response) {
  try {
    res.json(await getTeamBySlug(getSlugParam(req.params.slug)));
  } catch (error) {
    sendError(res, error);
  }
}

export async function createTeam(req: Request, res: Response) {
  try {
    const team = await createTeamWithRoster(req.body);
    res.status(201).json(team);
  } catch (error) {
    sendError(res, error);
  }
}

export async function updateTeam(req: Request, res: Response) {
  try {
    res.json(await updateTeamWithRoster(getSlugParam(req.params.slug), req.body));
  } catch (error) {
    sendError(res, error);
  }
}

export async function archiveTeam(req: Request, res: Response) {
  try {
    res.json(await archiveTeamBySlug(getSlugParam(req.params.slug)));
  } catch (error) {
    sendError(res, error);
  }
}
