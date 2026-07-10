import { EventStatus, PlayerPosition, Prisma } from "@prisma/client";
import { BASE_TEAM_POINTS } from "../../shared/constants/ranking.js";
import { prisma } from "../../shared/db/prisma.js";
import { ApiError, type ErrorDetail } from "../../shared/errors/api-error.js";
import { generateUniqueSlug } from "../../shared/utils/slug.js";

type UnknownRecord = Record<string, unknown>;
type TeamClient = Prisma.TransactionClient;

const TEAM_FIELDS = new Set([
  "name",
  "divisionId",
  "logoUrl",
  "primaryColor",
  "overallRating",
  "description",
  "profileRating",
  "players"
]);

const PLAYER_FIELDS = new Set(["id", "name", "number", "position", "isActive"]);
const PROFILE_FIELDS = new Set(["defense", "offense", "consistency", "cohesion", "depth"]);
const POSITIONS = new Set(Object.values(PlayerPosition));
const DEFAULT_PROFILE_RATING = {
  defense: 5,
  offense: 5,
  consistency: 5,
  cohesion: 5,
  depth: 5
};

type NormalizedPlayerInput = {
  id?: number;
  name?: string;
  number?: number;
  position?: PlayerPosition;
  isActive?: boolean;
  index: number;
};

type NormalizedTeamInput = {
  name?: string;
  divisionId?: number | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  overallRating?: number | null;
  description?: string | null;
  profileRating?: typeof DEFAULT_PROFILE_RATING;
  profileRatingProvided: boolean;
  players?: NormalizedPlayerInput[];
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validationError(details: ErrorDetail[]) {
  return new ApiError(400, "VALIDATION_ERROR", "Request validation failed.", details);
}

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function nullableString(
  body: UnknownRecord,
  field: string,
  maxLength: number,
  details: ErrorDetail[],
  options: { url?: boolean; color?: boolean } = {}
) {
  if (!(field in body)) {
    return undefined;
  }

  const value = trimString(body[field]);
  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    details.push({ field, message: `${field} must be a string or null` });
    return undefined;
  }

  if (value.length > maxLength) {
    details.push({ field, message: `${field} must be at most ${maxLength} characters` });
  }

  if (options.url && !/^(https?:\/\/\S+|\/[^\s?#]+)$/i.test(value)) {
    details.push({ field, message: `${field} must be a valid HTTP/HTTPS URL or site-relative path` });
  }

  if (options.color && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
    details.push({ field, message: `${field} must be a hex color like #AABBCC` });
  }

  return value;
}

function requiredString(body: UnknownRecord, field: string, maxLength: number, details: ErrorDetail[]) {
  if (!(field in body)) {
    details.push({ field, message: `${field} is required` });
    return undefined;
  }

  const value = trimString(body[field]);
  if (typeof value !== "string" || value.length === 0) {
    details.push({ field, message: `${field} is required` });
    return undefined;
  }

  if (value.length > maxLength) {
    details.push({ field, message: `${field} must be at most ${maxLength} characters` });
  }

  return value;
}

function optionalString(body: UnknownRecord, field: string, maxLength: number, details: ErrorDetail[]) {
  if (!(field in body)) {
    return undefined;
  }

  const value = trimString(body[field]);
  if (typeof value !== "string" || value.length === 0) {
    details.push({ field, message: `${field} is required` });
    return undefined;
  }

  if (value.length > maxLength) {
    details.push({ field, message: `${field} must be at most ${maxLength} characters` });
  }

  return value;
}

function requiredStringAtPath(
  body: UnknownRecord,
  field: string,
  path: string,
  maxLength: number,
  details: ErrorDetail[]
) {
  if (!(field in body)) {
    details.push({ field: path, message: `${field} is required` });
    return undefined;
  }

  const value = trimString(body[field]);
  if (typeof value !== "string" || value.length === 0) {
    details.push({ field: path, message: `${field} is required` });
    return undefined;
  }

  if (value.length > maxLength) {
    details.push({ field: path, message: `${field} must be at most ${maxLength} characters` });
  }

  return value;
}

function optionalStringAtPath(
  body: UnknownRecord,
  field: string,
  path: string,
  maxLength: number,
  details: ErrorDetail[]
) {
  if (!(field in body)) {
    return undefined;
  }

  const value = trimString(body[field]);
  if (typeof value !== "string" || value.length === 0) {
    details.push({ field: path, message: `${field} is required` });
    return undefined;
  }

  if (value.length > maxLength) {
    details.push({ field: path, message: `${field} must be at most ${maxLength} characters` });
  }

  return value;
}

function optionalInteger(body: UnknownRecord, field: string, details: ErrorDetail[], min?: number, max?: number) {
  if (!(field in body)) {
    return undefined;
  }

  const value = body[field];
  if (!Number.isInteger(value)) {
    details.push({ field, message: `${field} must be an integer` });
    return undefined;
  }

  const numberValue = value as number;
  if (min !== undefined && numberValue < min) {
    details.push({ field, message: `${field} must be at least ${min}` });
  }
  if (max !== undefined && numberValue > max) {
    details.push({ field, message: `${field} must be at most ${max}` });
  }
  return numberValue;
}

function optionalIntegerAtPath(
  body: UnknownRecord,
  field: string,
  path: string,
  details: ErrorDetail[],
  min?: number,
  max?: number
) {
  if (!(field in body)) {
    return undefined;
  }

  const value = body[field];
  if (!Number.isInteger(value)) {
    details.push({ field: path, message: `${field} must be an integer` });
    return undefined;
  }

  const numberValue = value as number;
  if (min !== undefined && numberValue < min) {
    details.push({ field: path, message: `${field} must be at least ${min}` });
  }
  if (max !== undefined && numberValue > max) {
    details.push({ field: path, message: `${field} must be at most ${max}` });
  }
  return numberValue;
}

function optionalNumber(body: UnknownRecord, field: string, details: ErrorDetail[], min: number, max: number) {
  if (!(field in body)) {
    return undefined;
  }

  const value = body[field];
  if (value === null) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    details.push({ field, message: `${field} must be a number` });
    return undefined;
  }

  if (value < min || value > max) {
    details.push({ field, message: `${field} must be between ${min} and ${max}` });
  }

  return value;
}

function validateProfileRating(body: UnknownRecord, details: ErrorDetail[]) {
  if (!("profileRating" in body)) {
    return { provided: false, value: undefined };
  }

  const value = body.profileRating;
  if (value === null) {
    details.push({ field: "profileRating", message: "profileRating cannot be null" });
    return { provided: true, value: undefined };
  }

  if (!isRecord(value)) {
    details.push({ field: "profileRating", message: "profileRating must be an object" });
    return { provided: true, value: undefined };
  }

  for (const key of Object.keys(value)) {
    if (!PROFILE_FIELDS.has(key)) {
      details.push({ field: `profileRating.${key}`, message: "unknown field" });
    }
  }

  const profile = { ...DEFAULT_PROFILE_RATING };
  for (const field of PROFILE_FIELDS) {
    if (!(field in value)) {
      details.push({ field: `profileRating.${field}`, message: `${field} is required` });
      continue;
    }

    const ratingValue = value[field];
    if (typeof ratingValue !== "number" || !Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 10) {
      details.push({ field: `profileRating.${field}`, message: `${field} must be a number from 1 to 10` });
      continue;
    }

    profile[field as keyof typeof profile] = ratingValue;
  }

  return { provided: true, value: profile };
}

function validatePlayers(body: UnknownRecord, details: ErrorDetail[], mode: "create" | "patch") {
  if (!("players" in body)) {
    return undefined;
  }

  if (!Array.isArray(body.players)) {
    details.push({ field: "players", message: "players must be an array" });
    return undefined;
  }

  return body.players.map((value, index): NormalizedPlayerInput => {
    const fieldPrefix = `players[${index}]`;
    if (!isRecord(value)) {
      details.push({ field: fieldPrefix, message: "player must be an object" });
      return { index };
    }

    for (const key of Object.keys(value)) {
      if (!PLAYER_FIELDS.has(key)) {
        details.push({ field: `${fieldPrefix}.${key}`, message: "unknown field" });
      }
    }

    const player: NormalizedPlayerInput = { index };
    if ("id" in value) {
      if (mode === "create") {
        details.push({ field: `${fieldPrefix}.id`, message: "id is not allowed when creating players" });
      }
      const id = optionalIntegerAtPath(value, "id", `${fieldPrefix}.id`, details, 1);
      if (id !== undefined) {
        player.id = id;
      }
    }

    const creating = player.id === undefined;
    if (creating) {
      player.name = requiredStringAtPath(value, "name", `${fieldPrefix}.name`, 100, details);
      player.number = optionalIntegerAtPath(value, "number", `${fieldPrefix}.number`, details, 0, 99);
      if (!("number" in value)) {
        details.push({ field: `${fieldPrefix}.number`, message: "number is required" });
      }
      if (!("position" in value)) {
        details.push({ field: `${fieldPrefix}.position`, message: "position is required" });
      }
      if (!("isActive" in value)) {
        details.push({ field: `${fieldPrefix}.isActive`, message: "isActive is required" });
      }
    } else {
      player.name = optionalStringAtPath(value, "name", `${fieldPrefix}.name`, 100, details);
      player.number = optionalIntegerAtPath(value, "number", `${fieldPrefix}.number`, details, 0, 99);
    }

    if ("position" in value) {
      if (typeof value.position !== "string" || !POSITIONS.has(value.position as PlayerPosition)) {
        details.push({ field: `${fieldPrefix}.position`, message: "position must be PG, SG, G, F, SF, PF, or C" });
      } else {
        player.position = value.position as PlayerPosition;
      }
    }

    if ("isActive" in value) {
      if (typeof value.isActive !== "boolean") {
        details.push({ field: `${fieldPrefix}.isActive`, message: "isActive must be a boolean" });
      } else {
        player.isActive = value.isActive;
      }
    }

    if (mode === "create" && player.isActive === false) {
      details.push({ field: `${fieldPrefix}.isActive`, message: "new players must be active" });
    }

    return player;
  });
}

function normalizeTeamInput(body: unknown, mode: "create" | "patch") {
  const details: ErrorDetail[] = [];
  if (!isRecord(body)) {
    throw validationError([{ field: "body", message: "request body must be an object" }]);
  }

  for (const key of Object.keys(body)) {
    if (!TEAM_FIELDS.has(key)) {
      details.push({ field: key, message: "unknown field" });
    }
  }

  const input: NormalizedTeamInput = { profileRatingProvided: false };

  if (mode === "create") {
    input.name = requiredString(body, "name", 100, details);
  } else {
    input.name = optionalString(body, "name", 100, details);
  }

  if ("divisionId" in body) {
    input.divisionId = body.divisionId === null ? null : optionalInteger(body, "divisionId", details, 1);
  }

  input.logoUrl = nullableString(body, "logoUrl", 2048, details, { url: true });
  input.primaryColor = nullableString(body, "primaryColor", 7, details, { color: true });
  input.description = nullableString(body, "description", 2000, details);
  input.overallRating = optionalNumber(body, "overallRating", details, 0, 10);

  const profile = validateProfileRating(body, details);
  input.profileRatingProvided = profile.provided;
  input.profileRating = profile.value;
  input.players = validatePlayers(body, details, mode);

  if (details.length > 0) {
    throw validationError(details);
  }

  return input;
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return roundOne(values.reduce((sum, value) => sum + value, 0) / values.length);
}

type RankingSource = {
  eventResults: Array<{ resultTag: { rankingPoints: number } }>;
};

function getTotalPoints(team: RankingSource) {
  return BASE_TEAM_POINTS + team.eventResults.reduce((sum, result) => sum + result.resultTag.rankingPoints, 0);
}

type MatchTotals = {
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
};

function emptyMatchTotals(): MatchTotals {
  return {
    points: 0,
    rebounds: 0,
    assists: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0
  };
}

async function getTeamStats(teamId: number) {
  // Team per-game averages sum this team's rostered player box-score lines per
  // match, then average across matches. MatchTeamOtherStat is deliberately
  // excluded: it is an exception bucket, not part of the team's real box score.
  const rows = await prisma.matchPlayerStat.findMany({
    where: {
      teamId,
      match: {
        voidedAt: null,
        event: {
          status: { in: [EventStatus.ONGOING, EventStatus.COMPLETED] },
          deletedAt: null,
          archivedAt: null
        }
      }
    }
  });

  const perMatch = new Map<number, MatchTotals>();
  for (const row of rows) {
    const totals = perMatch.get(row.matchId) ?? emptyMatchTotals();
    totals.points += row.points;
    totals.rebounds += row.rebounds;
    totals.assists += row.assists;
    totals.fieldGoalsMade += row.fieldGoalsMade;
    totals.fieldGoalsAttempted += row.fieldGoalsAttempted;
    totals.threePointersMade += row.threePointersMade;
    totals.threePointersAttempted += row.threePointersAttempted;
    perMatch.set(row.matchId, totals);
  }

  const matchTotals = [...perMatch.values()];
  return {
    gamesPlayed: perMatch.size,
    avgPoints: average(matchTotals.map((match) => match.points)),
    avgRebounds: average(matchTotals.map((match) => match.rebounds)),
    avgAssists: average(matchTotals.map((match) => match.assists)),
    avgFieldGoalsMade: average(matchTotals.map((match) => match.fieldGoalsMade)),
    avgFieldGoalsAttempted: average(matchTotals.map((match) => match.fieldGoalsAttempted)),
    avgThreePointersMade: average(matchTotals.map((match) => match.threePointersMade)),
    avgThreePointersAttempted: average(matchTotals.map((match) => match.threePointersAttempted))
  };
}

async function getPlayerStats(playerId: number, teamId: number) {
  const rows = await prisma.matchPlayerStat.findMany({
    where: {
      playerId,
      teamId,
      match: {
        voidedAt: null,
        event: {
          status: { in: [EventStatus.ONGOING, EventStatus.COMPLETED] },
          deletedAt: null,
          archivedAt: null
        }
      }
    }
  });

  const ratings = rows.flatMap((row) => (row.rating === null ? [] : [row.rating]));
  return {
    gamesPlayed: rows.length,
    avgPoints: average(rows.map((row) => row.points)),
    avgRebounds: average(rows.map((row) => row.rebounds)),
    avgAssists: average(rows.map((row) => row.assists)),
    avgFieldGoalsMade: average(rows.map((row) => row.fieldGoalsMade)),
    avgFieldGoalsAttempted: average(rows.map((row) => row.fieldGoalsAttempted)),
    avgThreePointersMade: average(rows.map((row) => row.threePointersMade)),
    avgThreePointersAttempted: average(rows.map((row) => row.threePointersAttempted)),
    avgMinutes: average(rows.map((row) => row.minutes)),
    avgRating: average(ratings)
  };
}

function profileForResponse(profile: {
  defense: number;
  offense: number;
  consistency: number;
  cohesion: number;
  depth: number;
} | null) {
  if (profile === null) {
    return null;
  }
  return {
    defense: profile.defense,
    offense: profile.offense,
    consistency: profile.consistency,
    cohesion: profile.cohesion,
    depth: profile.depth
  };
}

async function buildTeamDetail(slug: string) {
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      division: true,
      profileRating: true,
      players: {
        where: { isActive: true },
        orderBy: [{ number: "asc" }, { name: "asc" }, { id: "asc" }]
      },
      eventResults: {
        where: {
          event: {
            status: EventStatus.COMPLETED,
            countsForRanking: true,
            deletedAt: null,
            archivedAt: null
          }
        },
        select: {
          resultTag: {
            select: {
              rankingPoints: true
            }
          }
        }
      }
    }
  });

  if (team === null) {
    throw new ApiError(404, "TEAM_NOT_FOUND", "Team not found.");
  }

  const players = await Promise.all(
    team.players.map(async (player) => ({
      id: player.id,
      slug: player.slug,
      name: player.name,
      number: player.number,
      position: player.position,
      isActive: player.isActive,
      stats: await getPlayerStats(player.id, team.id)
    }))
  );

  return {
    id: team.id,
    slug: team.slug,
    name: team.name,
    logoUrl: team.logoUrl,
    primaryColor: team.primaryColor,
    divisionId: team.divisionId,
    divisionName: team.division?.name ?? null,
    divisionSlug: team.division?.slug ?? null,
    overallRating: team.overallRating,
    totalPoints: getTotalPoints(team),
    description: team.description,
    archivedAt: team.archivedAt?.toISOString() ?? null,
    profileRating: profileForResponse(team.profileRating),
    teamStats: await getTeamStats(team.id),
    players
  };
}

export async function getTeamsGroupedByDivision() {
  const teams = await prisma.team.findMany({
    where: {
      archivedAt: null,
      divisionId: { not: null }
    },
    include: {
      division: true,
      eventResults: {
        where: {
          event: {
            status: EventStatus.COMPLETED,
            countsForRanking: true,
            deletedAt: null,
            archivedAt: null
          }
        },
        select: {
          resultTag: {
            select: {
              rankingPoints: true
            }
          }
        }
      }
    }
  });

  const groups = new Map<number, {
    divisionId: number;
    divisionName: string;
    divisionSlug: string;
    divisionSortOrder: number;
    teams: Array<{
      id: number;
      slug: string;
      name: string;
      logoUrl: string | null;
      primaryColor: string | null;
      overallRating: number | null;
      totalPoints: number;
      archivedAt: string | null;
    }>;
  }>();

  for (const team of teams) {
    if (team.division === null) {
      continue;
    }

    const existing = groups.get(team.division.id) ?? {
      divisionId: team.division.id,
      divisionName: team.division.name,
      divisionSlug: team.division.slug,
      divisionSortOrder: team.division.sortOrder,
      teams: []
    };

    existing.teams.push({
      id: team.id,
      slug: team.slug,
      name: team.name,
      logoUrl: team.logoUrl,
      primaryColor: team.primaryColor,
      overallRating: team.overallRating,
      totalPoints: getTotalPoints(team),
      archivedAt: null
    });
    groups.set(team.division.id, existing);
  }

  const divisions = Array.from(groups.values()).sort((a, b) =>
    a.divisionSortOrder - b.divisionSortOrder ||
    a.divisionName.localeCompare(b.divisionName) ||
    a.divisionId - b.divisionId
  );

  for (const division of divisions) {
    division.teams.sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name) || a.id - b.id);
  }

  return { divisions };
}

export async function getTeamBySlug(slug: string) {
  return buildTeamDetail(slug);
}

async function ensureDivisionExists(divisionId: number) {
  const division = await prisma.division.findUnique({
    where: { id: divisionId },
    select: { id: true }
  });

  if (division === null) {
    throw new ApiError(404, "DIVISION_NOT_FOUND", "Division not found.");
  }
}

function buildTeamData(input: NormalizedTeamInput) {
  return {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.divisionId !== undefined && input.divisionId !== null ? { divisionId: input.divisionId } : {}),
    ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
    ...(input.primaryColor !== undefined ? { primaryColor: input.primaryColor } : {}),
    ...(input.overallRating !== undefined ? { overallRating: input.overallRating } : {}),
    ...(input.description !== undefined ? { description: input.description } : {})
  };
}

async function validateFinalRoster(teamId: number, players: NormalizedPlayerInput[] | undefined) {
  if (players === undefined) {
    return;
  }

  const existingPlayers = await prisma.player.findMany({
    where: { teamId },
    select: { id: true, number: true, isActive: true }
  });

  const existingIds = new Set(existingPlayers.map((player) => player.id));
  for (const player of players) {
    if (player.id !== undefined && !existingIds.has(player.id)) {
      throw new ApiError(404, "PLAYER_NOT_FOUND", "Player not found.");
    }
  }

  const finalRoster = new Map<number, { number: number; isActive: boolean; payloadIndexes: number[] }>();
  for (const player of existingPlayers) {
    finalRoster.set(player.id, { number: player.number, isActive: player.isActive, payloadIndexes: [] });
  }

  let tempId = -1;
  for (const player of players) {
    const id = player.id ?? tempId;
    tempId -= 1;

    const current = finalRoster.get(id) ?? { number: player.number ?? 0, isActive: true, payloadIndexes: [] };
    finalRoster.set(id, {
      number: player.number ?? current.number,
      isActive: player.isActive ?? current.isActive,
      payloadIndexes: [...current.payloadIndexes, player.index]
    });
  }

  const activeNumbers = new Map<number, Array<{ payloadIndexes: number[] }>>();
  for (const player of finalRoster.values()) {
    if (!player.isActive) {
      continue;
    }

    const entries = activeNumbers.get(player.number) ?? [];
    entries.push({ payloadIndexes: player.payloadIndexes });
    activeNumbers.set(player.number, entries);
  }

  const details: ErrorDetail[] = [];
  for (const [number, entries] of activeNumbers.entries()) {
    if (entries.length <= 1) {
      continue;
    }

    const indexes = entries.flatMap((entry) => entry.payloadIndexes);
    for (const index of indexes) {
      details.push({
        field: `players[${index}].number`,
        message: `number ${number} conflicts with another active player`
      });
    }
  }

  if (details.length > 0 || Array.from(activeNumbers.values()).some((entries) => entries.length > 1)) {
    throw new ApiError(
      409,
      "PLAYER_NUMBER_CONFLICT",
      "Active player numbers must be unique within a team.",
      details
    );
  }
}

async function createPlayers(client: TeamClient, teamId: number, players: NormalizedPlayerInput[] | undefined) {
  if (players === undefined) {
    return;
  }

  for (const player of players) {
    const slug = await generateUniqueSlug(client, "player", player.name ?? "", "player");
    await client.player.create({
      data: {
        teamId,
        slug,
        name: player.name ?? "",
        number: player.number ?? 0,
        position: player.position ?? PlayerPosition.G,
        isActive: player.isActive ?? true
      }
    });
  }
}

async function applyPlayerUpdates(client: TeamClient, teamId: number, players: NormalizedPlayerInput[] | undefined) {
  if (players === undefined) {
    return;
  }

  for (const player of players) {
    if (player.id === undefined) {
      const slug = await generateUniqueSlug(client, "player", player.name ?? "", "player");
      await client.player.create({
        data: {
          teamId,
          slug,
          name: player.name ?? "",
          number: player.number ?? 0,
          position: player.position ?? PlayerPosition.G,
          isActive: player.isActive ?? true
        }
      });
      continue;
    }

    await client.player.update({
      where: { id: player.id },
      data: {
        ...(player.name !== undefined ? { name: player.name } : {}),
        ...(player.number !== undefined ? { number: player.number } : {}),
        ...(player.position !== undefined ? { position: player.position } : {}),
        ...(player.isActive !== undefined ? { isActive: player.isActive } : {})
      }
    });
  }
}

async function upsertProfile(client: TeamClient, teamId: number, profile: typeof DEFAULT_PROFILE_RATING) {
  await client.teamProfileRating.upsert({
    where: { teamId },
    update: profile,
    create: { teamId, ...profile }
  });
}

export async function createTeamWithRoster(body: unknown) {
  const input = normalizeTeamInput(body, "create");

  if (input.divisionId === undefined || input.divisionId === null) {
    throw new ApiError(422, "ACTIVE_TEAM_REQUIRES_DIVISION", "Active team requires a division.");
  }

  const divisionId = input.divisionId;
  await ensureDivisionExists(divisionId);
  await validateFinalRoster(-1, input.players);

  let slugConflict = false;
  const slug = await generateUniqueSlug(prisma, "team", input.name ?? "", "team");

  try {
    await prisma.$transaction(async (client) => {
      const team = await client.team.create({
        data: {
          name: input.name ?? "",
          divisionId,
          logoUrl: input.logoUrl,
          primaryColor: input.primaryColor,
          overallRating: input.overallRating,
          description: input.description,
          slug
        },
        select: { id: true }
      });

      await upsertProfile(client, team.id, input.profileRating ?? DEFAULT_PROFILE_RATING);
      await createPlayers(client, team.id, input.players);
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      slugConflict = true;
    } else {
      throw error;
    }
  }

  if (slugConflict) {
    throw new ApiError(409, "SLUG_CONFLICT", "Unable to generate a unique slug.");
  }

  return buildTeamDetail(slug);
}

export async function updateTeamWithRoster(slug: string, body: unknown) {
  const input = normalizeTeamInput(body, "patch");

  const team = await prisma.team.findUnique({
    where: { slug },
    select: { id: true, archivedAt: true }
  });

  if (team === null) {
    throw new ApiError(404, "TEAM_NOT_FOUND", "Team not found.");
  }

  if (team.archivedAt !== null) {
    throw new ApiError(422, "TEAM_ARCHIVED", "Archived team cannot be modified.");
  }

  if (input.divisionId === null) {
    throw new ApiError(422, "ACTIVE_TEAM_REQUIRES_DIVISION", "Active team requires a division.");
  }

  if (input.divisionId !== undefined) {
    await ensureDivisionExists(input.divisionId);
  }

  await validateFinalRoster(team.id, input.players);

  await prisma.$transaction(async (client) => {
    await client.team.update({
      where: { id: team.id },
      data: buildTeamData(input)
    });

    if (input.profileRatingProvided && input.profileRating !== undefined) {
      await upsertProfile(client, team.id, input.profileRating);
    }

    await applyPlayerUpdates(client, team.id, input.players);
  });

  return buildTeamDetail(slug);
}

export async function archiveTeamBySlug(slug: string) {
  const team = await prisma.team.findUnique({
    where: { slug },
    select: { id: true, slug: true, archivedAt: true }
  });

  if (team === null) {
    throw new ApiError(404, "TEAM_NOT_FOUND", "Team not found.");
  }

  if (team.archivedAt !== null) {
    throw new ApiError(422, "TEAM_ALREADY_ARCHIVED", "Team is already archived.");
  }

  const archived = await prisma.team.update({
    where: { id: team.id },
    data: { archivedAt: new Date() },
    select: { id: true, slug: true, archivedAt: true }
  });

  return {
    id: archived.id,
    slug: archived.slug,
    archivedAt: archived.archivedAt?.toISOString() ?? null
  };
}
