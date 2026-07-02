import type { Request, Response } from "express";
import { sendError } from "../../shared/errors/api-error.js";
import {
  createMatch as createMatchRecord,
  getMatchById,
  getMatchFormOptions,
  listMatches,
  restoreMatch as restoreMatchRecord,
  updateMatch as updateMatchRecord,
  voidMatch as voidMatchRecord
} from "./matches.service.js";
import { assertNoRequestBody, parseMatchId, parseMatchInput, parseMatchListQuery, parseOptionalEventQuery } from "./matches.validation.js";

export async function listMatchesHandler(req: Request, res: Response) {
  try {
    res.json(await listMatches(parseMatchListQuery(req.query)));
  } catch (error) {
    sendError(res, error);
  }
}

export async function getFormOptionsHandler(req: Request, res: Response) {
  try {
    res.json(await getMatchFormOptions(parseOptionalEventQuery(req.query)));
  } catch (error) {
    sendError(res, error);
  }
}

export async function getMatchHandler(req: Request, res: Response) {
  try {
    res.json(await getMatchById(parseMatchId(req.params.id)));
  } catch (error) {
    sendError(res, error);
  }
}

export async function createMatchHandler(req: Request, res: Response) {
  try {
    res.status(201).json(await createMatchRecord(parseMatchInput(req.body, "create")));
  } catch (error) {
    sendError(res, error);
  }
}

export async function updateMatchHandler(req: Request, res: Response) {
  try {
    res.json(await updateMatchRecord(parseMatchId(req.params.id), parseMatchInput(req.body, "patch")));
  } catch (error) {
    sendError(res, error);
  }
}

export async function voidMatchHandler(req: Request, res: Response) {
  try {
    assertNoRequestBody(req.body);
    res.json(await voidMatchRecord(parseMatchId(req.params.id)));
  } catch (error) {
    sendError(res, error);
  }
}

export async function restoreMatchHandler(req: Request, res: Response) {
  try {
    assertNoRequestBody(req.body);
    res.json(await restoreMatchRecord(parseMatchId(req.params.id)));
  } catch (error) {
    sendError(res, error);
  }
}
