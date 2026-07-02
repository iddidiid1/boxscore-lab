import { MatchTeamRole } from "@prisma/client";
import { ApiError, type ErrorDetail } from "../../shared/errors/api-error.js";

type RecordValue = Record<string, unknown>;

export type PlayerStatInput = {
  playerId: number;
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  minutes: number;
  rating: number;
  index: number;
};

export type OtherStatInput = Omit<PlayerStatInput, "playerId" | "minutes" | "rating" | "index">;

export type MatchTeamInput = {
  role: MatchTeamRole;
  teamId: number;
  playerStats: PlayerStatInput[];
  otherStats: OtherStatInput;
  index: number;
};

export type MatchInput = {
  eventId?: number;
  stageTagId: number | null;
  playedAt: Date;
  teams: MatchTeamInput[];
};

export type MatchListQuery = {
  page: number;
  pageSize: number;
  eventId?: number;
  teamId?: number;
  stageTagId?: number;
};

const CREATE_FIELDS = new Set(["eventId", "stageTagId", "playedAt", "teams"]);
const PATCH_FIELDS = new Set(["stageTagId", "playedAt", "teams"]);
const TEAM_FIELDS = new Set(["role", "teamId", "playerStats", "otherStats"]);
const PLAYER_STAT_FIELDS = new Set([
  "playerId",
  "points",
  "rebounds",
  "assists",
  "fieldGoalsMade",
  "fieldGoalsAttempted",
  "threePointersMade",
  "threePointersAttempted",
  "minutes",
  "rating"
]);
const OTHER_STAT_FIELDS = new Set([
  "points",
  "rebounds",
  "assists",
  "fieldGoalsMade",
  "fieldGoalsAttempted",
  "threePointersMade",
  "threePointersAttempted"
]);
const LIST_QUERY_FIELDS = new Set(["page", "pageSize", "eventId", "teamId", "stageTagId"]);
const TIMEZONE_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(details: ErrorDetail[]): never {
  throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed.", details);
}

function unknownFields(value: RecordValue, allowed: Set<string>, prefix: string, details: ErrorDetail[]) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) details.push({ field: prefix ? `${prefix}.${key}` : key, message: "unknown field" });
  }
}

function integer(value: unknown, path: string, details: ErrorDetail[], min = 0, max = 10000) {
  if (!Number.isInteger(value)) {
    details.push({ field: path, message: "must be an integer" });
    return 0;
  }
  const number = value as number;
  if (number < min || number > max) details.push({ field: path, message: `must be an integer from ${min} to ${max}` });
  return number;
}

function positiveId(value: unknown, path: string, details: ErrorDetail[]) {
  return integer(value, path, details, 1, Number.MAX_SAFE_INTEGER);
}

function numericStats(value: RecordValue, path: string, details: ErrorDetail[], player: true): OtherStatInput & { minutes: number; rating: number };
function numericStats(value: RecordValue, path: string, details: ErrorDetail[], player: false): OtherStatInput;
function numericStats(value: RecordValue, path: string, details: ErrorDetail[], player: boolean) {
  const stats = {
    points: integer(value.points, `${path}.points`, details),
    rebounds: integer(value.rebounds, `${path}.rebounds`, details),
    assists: integer(value.assists, `${path}.assists`, details),
    fieldGoalsMade: integer(value.fieldGoalsMade, `${path}.fieldGoalsMade`, details),
    fieldGoalsAttempted: integer(value.fieldGoalsAttempted, `${path}.fieldGoalsAttempted`, details),
    threePointersMade: integer(value.threePointersMade, `${path}.threePointersMade`, details),
    threePointersAttempted: integer(value.threePointersAttempted, `${path}.threePointersAttempted`, details)
  };

  if (stats.fieldGoalsMade > stats.fieldGoalsAttempted) details.push({ field: `${path}.fieldGoalsMade`, message: "cannot exceed fieldGoalsAttempted" });
  if (stats.threePointersMade > stats.threePointersAttempted) details.push({ field: `${path}.threePointersMade`, message: "cannot exceed threePointersAttempted" });
  if (stats.threePointersMade > stats.fieldGoalsMade) details.push({ field: `${path}.threePointersMade`, message: "cannot exceed fieldGoalsMade" });
  if (stats.threePointersAttempted > stats.fieldGoalsAttempted) details.push({ field: `${path}.threePointersAttempted`, message: "cannot exceed fieldGoalsAttempted" });

  if (!player) return stats;
  const ratingValue = value.rating;
  let rating = 0;
  if (typeof ratingValue !== "number" || !Number.isFinite(ratingValue)) {
    details.push({ field: `${path}.rating`, message: "must be a finite number" });
  } else {
    rating = ratingValue;
    if (rating < 0 || rating > 10 || !Number.isInteger(rating * 10)) {
      details.push({ field: `${path}.rating`, message: "must be from 0 to 10 with at most one decimal place" });
    }
  }
  return { ...stats, minutes: integer(value.minutes, `${path}.minutes`, details), rating };
}

function parseTeams(value: unknown, details: ErrorDetail[]) {
  if (!Array.isArray(value)) {
    details.push({ field: "teams", message: "must be an array with HOME and AWAY" });
    return [];
  }
  if (value.length !== 2) details.push({ field: "teams", message: "must contain exactly two teams" });
  const seenRoles = new Set<MatchTeamRole>();
  const seenTeams = new Set<number>();
  const seenPlayers = new Set<number>();

  const teams = value.map((item, index): MatchTeamInput => {
    const path = `teams[${index}]`;
    if (!isRecord(item)) {
      details.push({ field: path, message: "must be an object" });
      return { role: MatchTeamRole.HOME, teamId: 0, playerStats: [], otherStats: emptyOther(), index };
    }
    unknownFields(item, TEAM_FIELDS, path, details);
    let role: MatchTeamRole = MatchTeamRole.HOME;
    if (item.role !== MatchTeamRole.HOME && item.role !== MatchTeamRole.AWAY) {
      details.push({ field: `${path}.role`, message: "must be HOME or AWAY" });
    } else {
      role = item.role;
      if (seenRoles.has(role)) details.push({ field: `${path}.role`, message: "duplicate role" });
      seenRoles.add(role);
    }
    const teamId = positiveId(item.teamId, `${path}.teamId`, details);
    if (teamId > 0 && seenTeams.has(teamId)) details.push({ field: `${path}.teamId`, message: "teams must be different" });
    seenTeams.add(teamId);

    const playerStats: PlayerStatInput[] = [];
    if (!Array.isArray(item.playerStats) || item.playerStats.length === 0) {
      details.push({ field: `${path}.playerStats`, message: "must be a non-empty array" });
    } else {
      item.playerStats.forEach((stat, statIndex) => {
        const statPath = `${path}.playerStats[${statIndex}]`;
        if (!isRecord(stat)) {
          details.push({ field: statPath, message: "must be an object" });
          return;
        }
        unknownFields(stat, PLAYER_STAT_FIELDS, statPath, details);
        const playerId = positiveId(stat.playerId, `${statPath}.playerId`, details);
        if (playerId > 0 && seenPlayers.has(playerId)) details.push({ field: `${statPath}.playerId`, message: "duplicate playerId in match" });
        seenPlayers.add(playerId);
        playerStats.push({ playerId, ...numericStats(stat, statPath, details, true), index: statIndex });
      });
    }

    let otherStats = emptyOther();
    if (!isRecord(item.otherStats)) {
      details.push({ field: `${path}.otherStats`, message: "is required" });
    } else {
      unknownFields(item.otherStats, OTHER_STAT_FIELDS, `${path}.otherStats`, details);
      otherStats = numericStats(item.otherStats, `${path}.otherStats`, details, false);
    }
    return { role, teamId, playerStats, otherStats, index };
  });

  if (!seenRoles.has(MatchTeamRole.HOME)) details.push({ field: "teams", message: "HOME team is required" });
  if (!seenRoles.has(MatchTeamRole.AWAY)) details.push({ field: "teams", message: "AWAY team is required" });
  return teams;
}

function emptyOther(): OtherStatInput {
  return { points: 0, rebounds: 0, assists: 0, fieldGoalsMade: 0, fieldGoalsAttempted: 0, threePointersMade: 0, threePointersAttempted: 0 };
}

export function parseMatchInput(body: unknown, mode: "create" | "patch"): MatchInput {
  const details: ErrorDetail[] = [];
  if (!isRecord(body)) fail([{ field: "body", message: "request body must be an object" }]);
  unknownFields(body, mode === "create" ? CREATE_FIELDS : PATCH_FIELDS, "", details);
  const eventId = mode === "create" ? positiveId(body.eventId, "eventId", details) : undefined;
  let stageTagId: number | null = null;
  if (!("stageTagId" in body)) details.push({ field: "stageTagId", message: "is required" });
  else if (body.stageTagId !== null) stageTagId = positiveId(body.stageTagId, "stageTagId", details);

  let playedAt = new Date(0);
  if (typeof body.playedAt !== "string" || !TIMEZONE_ISO.test(body.playedAt)) {
    details.push({ field: "playedAt", message: "must be an ISO 8601 date-time with timezone" });
  } else {
    playedAt = new Date(body.playedAt);
    if (Number.isNaN(playedAt.getTime())) details.push({ field: "playedAt", message: "must be a valid date-time" });
    else if (playedAt.getTime() > Date.now()) details.push({ field: "playedAt", message: "cannot be in the future" });
  }
  const teams = parseTeams(body.teams, details);
  if (details.length) fail(details);
  return { eventId, stageTagId, playedAt, teams };
}

function queryString(value: unknown) {
  return Array.isArray(value) ? undefined : typeof value === "string" ? value : undefined;
}

function queryInteger(value: unknown, path: string, details: ErrorDetail[], fallback?: number, max = Number.MAX_SAFE_INTEGER) {
  if (value === undefined && fallback !== undefined) return fallback;
  const string = queryString(value);
  if (!string || !/^\d+$/.test(string)) {
    details.push({ field: path, message: "must be a positive integer" });
    return fallback ?? 0;
  }
  const parsed = Number(string);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) details.push({ field: path, message: `must be from 1 to ${max}` });
  return parsed;
}

export function parseMatchListQuery(query: Record<string, unknown>): MatchListQuery {
  const details: ErrorDetail[] = [];
  unknownFields(query, LIST_QUERY_FIELDS, "", details);
  const page = queryInteger(query.page, "page", details, 1);
  const pageSize = queryInteger(query.pageSize, "pageSize", details, 10, 50);
  const eventId = query.eventId === undefined ? undefined : queryInteger(query.eventId, "eventId", details);
  const teamId = query.teamId === undefined ? undefined : queryInteger(query.teamId, "teamId", details);
  const stageTagId = query.stageTagId === undefined ? undefined : queryInteger(query.stageTagId, "stageTagId", details);
  if (stageTagId !== undefined && eventId === undefined) details.push({ field: "stageTagId", message: "eventId is required when filtering by stageTagId" });
  if (details.length) fail(details);
  return { page, pageSize, eventId, teamId, stageTagId };
}

export function parseOptionalEventQuery(query: Record<string, unknown>) {
  const details: ErrorDetail[] = [];
  unknownFields(query, new Set(["eventId"]), "", details);
  const eventId = query.eventId === undefined ? undefined : queryInteger(query.eventId, "eventId", details);
  if (details.length) fail(details);
  return eventId;
}

export function parseMatchId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d+$/.test(raw) || Number(raw) < 1 || !Number.isSafeInteger(Number(raw))) {
    fail([{ field: "id", message: "must be a positive integer" }]);
  }
  return Number(raw);
}

export function assertNoRequestBody(body: unknown) {
  if (body === undefined || body === null) return;
  if (isRecord(body) && Object.keys(body).length === 0) return;
  fail([{ field: "body", message: "request body is not allowed" }]);
}
