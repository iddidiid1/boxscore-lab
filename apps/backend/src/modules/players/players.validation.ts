import { PlayerPosition } from "@prisma/client";
import { ApiError, type ErrorDetail } from "../../shared/errors/api-error.js";

export const PLAYER_SORT_FIELDS = ["points", "rebounds", "assists", "fieldGoalPercentage", "threePointPercentage", "rating"] as const;
export type PlayerSortField = typeof PLAYER_SORT_FIELDS[number];
export type PlayerListQuery = { page: number; pageSize: number; eventId?: number; teamId?: number; position?: PlayerPosition; sortBy: PlayerSortField; sortDirection: "asc" | "desc" };
export type PlayerDetailQuery = { page: number; pageSize: number; eventId?: number };

function fail(details: ErrorDetail[]): never { throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed.", details); }
function integer(value: unknown, field: string, details: ErrorDetail[], fallback?: number, max = Number.MAX_SAFE_INTEGER) {
  if (value === undefined && fallback !== undefined) return fallback;
  const raw = Array.isArray(value) ? undefined : value;
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) { details.push({ field, message: "must be a positive integer" }); return fallback ?? 0; }
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) details.push({ field, message: `must be from 1 to ${max}` });
  return parsed;
}
function unknown(query: Record<string, unknown>, allowed: Set<string>, details: ErrorDetail[]) {
  Object.keys(query).forEach((field) => { if (!allowed.has(field)) details.push({ field, message: "unknown field" }); });
}

export function parsePlayerListQuery(query: Record<string, unknown>): PlayerListQuery {
  const details: ErrorDetail[] = [];
  unknown(query, new Set(["page", "pageSize", "eventId", "teamId", "position", "sortBy", "sortDirection"]), details);
  const page = integer(query.page, "page", details, 1);
  const pageSize = integer(query.pageSize, "pageSize", details, 10, 50);
  const eventId = query.eventId === undefined ? undefined : integer(query.eventId, "eventId", details);
  const teamId = query.teamId === undefined ? undefined : integer(query.teamId, "teamId", details);
  const position = query.position as PlayerPosition | undefined;
  if (position !== undefined && !Object.values(PlayerPosition).includes(position)) details.push({ field: "position", message: "must be a valid player position" });
  const sortBy = (query.sortBy ?? "points") as PlayerSortField;
  if (!PLAYER_SORT_FIELDS.includes(sortBy)) details.push({ field: "sortBy", message: "must be a supported statistic" });
  const sortDirection = (query.sortDirection ?? "desc") as "asc" | "desc";
  if (!(["asc", "desc"] as string[]).includes(sortDirection)) details.push({ field: "sortDirection", message: "must be asc or desc" });
  if (details.length) fail(details);
  return { page, pageSize, eventId, teamId, position, sortBy, sortDirection };
}

export function parsePlayerDetailQuery(query: Record<string, unknown>): PlayerDetailQuery {
  const details: ErrorDetail[] = [];
  unknown(query, new Set(["page", "pageSize", "eventId"]), details);
  const page = integer(query.page, "page", details, 1);
  const pageSize = integer(query.pageSize, "pageSize", details, 10, 50);
  const eventId = query.eventId === undefined ? undefined : integer(query.eventId, "eventId", details);
  if (details.length) fail(details);
  return { page, pageSize, eventId };
}

export function parsePlayerSlug(value: string | string[] | undefined) {
  const slug = Array.isArray(value) ? value[0] : value;
  if (!slug?.trim()) fail([{ field: "slug", message: "must not be empty" }]);
  return slug;
}
