import { Router } from "express";
import {
  archiveEvent,
  createEvent,
  getEvent,
  listEvents,
  updateEvent,
  updateEventOutcomes
} from "./events.controller.js";

export const eventsRoutes = Router();

eventsRoutes.get("/", listEvents);
eventsRoutes.post("/", createEvent);
eventsRoutes.get("/:slug", getEvent);
eventsRoutes.patch("/:slug", updateEvent);
eventsRoutes.patch("/:slug/outcomes", updateEventOutcomes);
eventsRoutes.post("/:slug/archive", archiveEvent);
