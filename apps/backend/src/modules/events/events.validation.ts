import { EventStatus, EventTier, PlayerAwardType } from "@prisma/client";
import { ApiError, type ErrorDetail } from "../../shared/errors/api-error.js";

type RecordValue = Record<string, unknown>;

export type TagInput = {
  id?: number;
  label: string;
  description?: string | null;
  isWinnerTag?: boolean;
  rankingPoints?: number;
  sortOrder: number;
  index: number;
};

export type EventInput = {
  name?: string;
  tier?: EventTier;
  status?: EventStatus;
  description?: string | null;
  countsForRanking?: boolean;
  participantTeamIds?: number[];
  stageTags?: TagInput[];
  resultTags?: TagInput[];
};

export type TeamResultInput = { teamId: number; resultTagId: number; notes?: string | null; index: number };
export type PlayerAwardInput = {
  awardType: PlayerAwardType;
  playerId: number;
  teamId: number;
  notes?: string | null;
  index: number;
};
export type OutcomesInput = { teamResults?: TeamResultInput[]; playerAwards?: PlayerAwardInput[] };

const CREATE_FIELDS = new Set(["name", "tier", "description", "countsForRanking", "participantTeamIds", "stageTags", "resultTags"]);
const PATCH_FIELDS = new Set([...CREATE_FIELDS, "status"]);
const OUTCOME_FIELDS = new Set(["teamResults", "playerAwards"]);
const STAGE_FIELDS = new Set(["id", "label", "description", "sortOrder"]);
const RESULT_FIELDS = new Set(["id", "label", "isWinnerTag", "rankingPoints", "sortOrder"]);
const TEAM_RESULT_FIELDS = new Set(["teamId", "resultTagId", "notes"]);
const AWARD_FIELDS = new Set(["awardType", "playerId", "teamId", "notes"]);

function record(value: unknown): value is RecordValue {
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

function stringValue(value: unknown, path: string, details: ErrorDetail[], max: number, required: boolean) {
  if (value === null && !required) return null;
  if (typeof value !== "string") {
    details.push({ field: path, message: required ? "is required" : "must be a string or null" });
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed && required) details.push({ field: path, message: "is required" });
  if (trimmed.length > max) details.push({ field: path, message: `must be at most ${max} characters` });
  return !trimmed && !required ? null : trimmed;
}

function integer(value: unknown, path: string, details: ErrorDetail[], min = 1, max?: number) {
  if (!Number.isInteger(value)) {
    details.push({ field: path, message: "must be an integer" });
    return undefined;
  }
  const number = value as number;
  if (number < min || (max !== undefined && number > max)) details.push({ field: path, message: `must be between ${min} and ${max ?? "infinity"}` });
  return number;
}

function tags(value: unknown, kind: "stageTags" | "resultTags", details: ErrorDetail[]) {
  if (!Array.isArray(value)) {
    details.push({ field: kind, message: `${kind} must be an array` });
    return undefined;
  }
  const ids = new Set<number>();
  let winnerSeen = false;
  return value.map((item, index): TagInput => {
    const path = `${kind}[${index}]`;
    if (!record(item)) {
      details.push({ field: path, message: "must be an object" });
      return { label: "", sortOrder: index, index };
    }
    unknownFields(item, kind === "stageTags" ? STAGE_FIELDS : RESULT_FIELDS, path, details);
    const result: TagInput = {
      label: stringValue(item.label, `${path}.label`, details, 80, true) ?? "",
      sortOrder: "sortOrder" in item ? integer(item.sortOrder, `${path}.sortOrder`, details, 0) ?? index : index,
      index
    };
    if ("id" in item) {
      const id = integer(item.id, `${path}.id`, details);
      if (id !== undefined) {
        if (ids.has(id)) details.push({ field: `${path}.id`, message: "duplicate id" });
        ids.add(id);
        result.id = id;
      }
    }
    if ("description" in item) result.description = stringValue(item.description, `${path}.description`, details, 500, false);
    if (kind === "resultTags") {
      if (typeof item.isWinnerTag !== "boolean") details.push({ field: `${path}.isWinnerTag`, message: "must be a boolean" });
      else {
        result.isWinnerTag = item.isWinnerTag;
        if (item.isWinnerTag && winnerSeen) details.push({ field: `${path}.isWinnerTag`, message: "only one winner tag is allowed" });
        winnerSeen ||= item.isWinnerTag;
      }
      result.rankingPoints = integer(item.rankingPoints, `${path}.rankingPoints`, details, 0, 100000);
    }
    return result;
  });
}

export function parseEventInput(body: unknown, mode: "create" | "patch"): EventInput {
  const details: ErrorDetail[] = [];
  if (!record(body)) fail([{ field: "body", message: "request body must be an object" }]);
  unknownFields(body, mode === "create" ? CREATE_FIELDS : PATCH_FIELDS, "", details);
  if (mode === "patch" && Object.keys(body).length === 0) details.push({ field: "body", message: "at least one field is required" });
  const input: EventInput = {};
  if (mode === "create" || "name" in body) input.name = stringValue(body.name, "name", details, 100, true) ?? undefined;
  if (mode === "create" || "tier" in body) {
    if (typeof body.tier !== "string" || !Object.values(EventTier).includes(body.tier as EventTier)) details.push({ field: "tier", message: "must be S, A, B, or C" });
    else input.tier = body.tier as EventTier;
  }
  if ("status" in body) {
    if (mode === "create") details.push({ field: "status", message: "status is not allowed when creating an event" });
    else if (typeof body.status !== "string" || !Object.values(EventStatus).includes(body.status as EventStatus)) details.push({ field: "status", message: "must be PREPARING, ONGOING, or COMPLETED" });
    else input.status = body.status as EventStatus;
  }
  if ("description" in body) input.description = stringValue(body.description, "description", details, 2000, false);
  if ("countsForRanking" in body) {
    if (typeof body.countsForRanking !== "boolean") details.push({ field: "countsForRanking", message: "must be a boolean" });
    else input.countsForRanking = body.countsForRanking;
  }
  if ("participantTeamIds" in body) {
    if (!Array.isArray(body.participantTeamIds)) details.push({ field: "participantTeamIds", message: "must be an array" });
    else {
      const seen = new Set<number>();
      input.participantTeamIds = body.participantTeamIds.flatMap((value, index) => {
        const id = integer(value, `participantTeamIds[${index}]`, details);
        if (id === undefined) return [];
        if (seen.has(id)) details.push({ field: `participantTeamIds[${index}]`, message: "duplicate team id" });
        seen.add(id);
        return [id];
      });
    }
  }
  if ("stageTags" in body) input.stageTags = tags(body.stageTags, "stageTags", details);
  if ("resultTags" in body) input.resultTags = tags(body.resultTags, "resultTags", details);
  if (details.length) fail(details);
  return input;
}

export function parseOutcomesInput(body: unknown): OutcomesInput {
  const details: ErrorDetail[] = [];
  if (!record(body)) fail([{ field: "body", message: "request body must be an object" }]);
  unknownFields(body, OUTCOME_FIELDS, "", details);
  if (!("teamResults" in body) && !("playerAwards" in body)) details.push({ field: "body", message: "teamResults or playerAwards is required" });
  const output: OutcomesInput = {};
  if ("teamResults" in body) {
    if (!Array.isArray(body.teamResults)) details.push({ field: "teamResults", message: "must be an array" });
    else {
      const seen = new Set<number>();
      output.teamResults = body.teamResults.map((item, index) => {
        const path = `teamResults[${index}]`;
        if (!record(item)) { details.push({ field: path, message: "must be an object" }); return { teamId: 0, resultTagId: 0, index }; }
        unknownFields(item, TEAM_RESULT_FIELDS, path, details);
        const teamId = integer(item.teamId, `${path}.teamId`, details) ?? 0;
        if (seen.has(teamId)) details.push({ field: `${path}.teamId`, message: "duplicate team result" });
        seen.add(teamId);
        return { teamId, resultTagId: integer(item.resultTagId, `${path}.resultTagId`, details) ?? 0, notes: "notes" in item ? stringValue(item.notes, `${path}.notes`, details, 1000, false) : undefined, index };
      });
    }
  }
  if ("playerAwards" in body) {
    if (!Array.isArray(body.playerAwards)) details.push({ field: "playerAwards", message: "must be an array" });
    else {
      const seen = new Set<string>();
      output.playerAwards = body.playerAwards.map((item, index) => {
        const path = `playerAwards[${index}]`;
        if (!record(item)) { details.push({ field: path, message: "must be an object" }); return { awardType: PlayerAwardType.EVENT_MVP, playerId: 0, teamId: 0, index }; }
        unknownFields(item, AWARD_FIELDS, path, details);
        const awardType = typeof item.awardType === "string" && Object.values(PlayerAwardType).includes(item.awardType as PlayerAwardType) ? item.awardType as PlayerAwardType : undefined;
        if (!awardType) details.push({ field: `${path}.awardType`, message: "invalid award type" });
        const playerId = integer(item.playerId, `${path}.playerId`, details) ?? 0;
        const key = `${playerId}:${awardType}`;
        if (seen.has(key)) details.push({ field: `${path}.playerId`, message: "duplicate player award" });
        seen.add(key);
        return { awardType: awardType ?? PlayerAwardType.EVENT_MVP, playerId, teamId: integer(item.teamId, `${path}.teamId`, details) ?? 0, notes: "notes" in item ? stringValue(item.notes, `${path}.notes`, details, 1000, false) : undefined, index };
      });
    }
  }
  if (details.length) fail(details);
  return output;
}
