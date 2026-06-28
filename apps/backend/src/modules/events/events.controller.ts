import type { Request, Response } from "express";
import { sendError } from "../../shared/errors/api-error.js";
import {
  archiveEventBySlug,
  createEventWithConfiguration,
  getEventBySlug,
  listActiveEvents,
  updateEventBySlug,
  updateEventOutcomesBySlug
} from "./events.service.js";

function slugParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export async function listEvents(_req: Request, res: Response) {
  try {
    res.json(await listActiveEvents());
  } catch (error) {
    sendError(res, error);
  }
}

export async function getEvent(req: Request, res: Response) {
  try {
    res.json(await getEventBySlug(slugParam(req.params.slug)));
  } catch (error) {
    sendError(res, error);
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    res.status(201).json(await createEventWithConfiguration(req.body));
  } catch (error) {
    sendError(res, error);
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    res.json(await updateEventBySlug(slugParam(req.params.slug), req.body));
  } catch (error) {
    sendError(res, error);
  }
}

export async function updateEventOutcomes(req: Request, res: Response) {
  try {
    res.json(await updateEventOutcomesBySlug(slugParam(req.params.slug), req.body));
  } catch (error) {
    sendError(res, error);
  }
}

export async function archiveEvent(req: Request, res: Response) {
  try {
    res.json(await archiveEventBySlug(slugParam(req.params.slug)));
  } catch (error) {
    sendError(res, error);
  }
}
