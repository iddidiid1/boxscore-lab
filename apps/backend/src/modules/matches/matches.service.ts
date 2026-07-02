import { EventStatus, MatchTeamRole, PlayerPosition, Prisma } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import { ApiError, type ErrorDetail } from "../../shared/errors/api-error.js";
import type { MatchInput, MatchListQuery, MatchTeamInput } from "./matches.validation.js";

const detailInclude = {
  event: true,
  stageTag: true,
  teams: { include: { team: true } },
  playerStats: { include: { player: true } },
  otherStats: true
} satisfies Prisma.MatchInclude;

type MatchDetailRecord = Prisma.MatchGetPayload<{ include: typeof detailInclude }>;

const POSITION_RANK: Record<PlayerPosition, number> = {
  PG: 0,
  SG: 1,
  SF: 2,
  PF: 3,
  C: 4,
  G: 5,
  F: 6
};

function iso(value: Date | null) {
  return value?.toISOString() ?? null;
}

function percentage(made: number, attempted: number) {
  if (attempted === 0) return null;
  return Math.round((made / attempted) * 1000) / 10;
}

function teamSummary(team: MatchDetailRecord["teams"][number]["team"], includeArchived = false) {
  return {
    id: team.id,
    slug: team.slug,
    name: team.name,
    primaryColor: team.primaryColor,
    ...(includeArchived ? { archivedAt: iso(team.archivedAt) } : {})
  };
}

function statShape(stat: {
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
}) {
  return {
    points: stat.points,
    rebounds: stat.rebounds,
    assists: stat.assists,
    fieldGoalsMade: stat.fieldGoalsMade,
    fieldGoalsAttempted: stat.fieldGoalsAttempted,
    fieldGoalPercentage: percentage(stat.fieldGoalsMade, stat.fieldGoalsAttempted),
    threePointersMade: stat.threePointersMade,
    threePointersAttempted: stat.threePointersAttempted,
    threePointPercentage: percentage(stat.threePointersMade, stat.threePointersAttempted)
  };
}

function scoreFor(match: MatchDetailRecord, teamId: number) {
  const players = match.playerStats.filter((stat) => stat.teamId === teamId).reduce((sum, stat) => sum + stat.points, 0);
  const other = match.otherStats.find((stat) => stat.teamId === teamId)?.points ?? 0;
  return players + other;
}

function comparePlayers(
  first: MatchDetailRecord["playerStats"][number],
  second: MatchDetailRecord["playerStats"][number]
) {
  return POSITION_RANK[first.player.position] - POSITION_RANK[second.player.position]
    || first.player.number - second.player.number
    || first.player.name.localeCompare(second.player.name)
    || first.player.id - second.player.id;
}

function serializeDetail(match: MatchDetailRecord) {
  const matchTeams = [...match.teams].sort((a, b) => a.role === MatchTeamRole.HOME ? -1 : b.role === MatchTeamRole.HOME ? 1 : 0);
  return {
    id: match.id,
    playedAt: match.playedAt.toISOString(),
    voidedAt: iso(match.voidedAt),
    event: {
      id: match.event.id,
      slug: match.event.slug,
      name: match.event.name,
      status: match.event.status,
      archivedAt: iso(match.event.archivedAt),
      deletedAt: iso(match.event.deletedAt)
    },
    stageTag: match.stageTag ? { id: match.stageTag.id, slug: match.stageTag.slug, label: match.stageTag.label } : null,
    teams: matchTeams.map((matchTeam) => {
      const playerStats = match.playerStats
        .filter((stat) => stat.teamId === matchTeam.teamId)
        .sort(comparePlayers)
        .map((stat) => ({
          playerId: stat.player.id,
          playerSlug: stat.player.slug,
          playerName: stat.player.name,
          playerNumber: stat.player.number,
          position: stat.player.position,
          isActive: stat.player.isActive,
          ...statShape(stat),
          minutes: stat.minutes,
          rating: stat.rating
        }));
      const other = match.otherStats.find((stat) => stat.teamId === matchTeam.teamId);
      return {
        role: matchTeam.role,
        team: teamSummary(matchTeam.team, true),
        score: scoreFor(match, matchTeam.teamId),
        playerStats,
        otherStats: other ? statShape(other) : statShape({ points: 0, rebounds: 0, assists: 0, fieldGoalsMade: 0, fieldGoalsAttempted: 0, threePointersMade: 0, threePointersAttempted: 0 })
      };
    }),
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString()
  };
}

async function findDetail(id: number) {
  return prisma.match.findUnique({ where: { id }, include: detailInclude });
}

function notFound(resource: "MATCH" | "EVENT" | "TEAM" | "STAGE_TAG" | "PLAYER"): never {
  throw new ApiError(404, `${resource}_NOT_FOUND`, `${resource.toLowerCase().replace("_", " ")} not found.`);
}

function eventAvailable(event: { status: EventStatus; archivedAt: Date | null; deletedAt: Date | null }) {
  return (event.status === EventStatus.ONGOING || event.status === EventStatus.COMPLETED) && event.archivedAt === null && event.deletedAt === null;
}

async function validateListResources(query: MatchListQuery) {
  if (query.eventId !== undefined && !(await prisma.event.findUnique({ where: { id: query.eventId }, select: { id: true } }))) notFound("EVENT");
  if (query.stageTagId !== undefined) {
    const stage = await prisma.eventStageTag.findUnique({ where: { id: query.stageTagId }, select: { eventId: true } });
    if (!stage) notFound("STAGE_TAG");
    if (stage.eventId !== query.eventId) throw new ApiError(422, "STAGE_TAG_EVENT_MISMATCH", "Stage tag does not belong to event.");
  }
  if (query.teamId !== undefined && !(await prisma.team.findUnique({ where: { id: query.teamId }, select: { id: true } }))) notFound("TEAM");
}

export async function listMatches(query: MatchListQuery) {
  await validateListResources(query);
  const visible: Prisma.MatchWhereInput = {
    voidedAt: null,
    event: { archivedAt: null, deletedAt: null },
    ...(query.eventId !== undefined ? { eventId: query.eventId } : {}),
    ...(query.teamId !== undefined ? { teams: { some: { teamId: query.teamId } } } : {}),
    ...(query.stageTagId !== undefined ? { stageTagId: query.stageTagId } : {})
  };
  const [matches, totalItems, optionMatches] = await prisma.$transaction([
    prisma.match.findMany({
      where: visible,
      include: detailInclude,
      orderBy: [{ playedAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize
    }),
    prisma.match.count({ where: visible }),
    prisma.match.findMany({
      where: { voidedAt: null, event: { archivedAt: null, deletedAt: null }, ...(query.eventId !== undefined ? { eventId: query.eventId } : {}) },
      include: { event: true, stageTag: true, teams: { include: { team: true } } }
    })
  ]);

  const allVisibleEvents = await prisma.match.findMany({
    where: { voidedAt: null, event: { archivedAt: null, deletedAt: null } },
    select: { event: { select: { id: true, name: true } } },
    distinct: ["eventId"]
  });
  const teams = new Map<number, { id: number; name: string }>();
  const stageTags = new Map<number, { id: number; eventId: number; label: string }>();
  for (const match of optionMatches) {
    for (const matchTeam of match.teams) teams.set(matchTeam.team.id, { id: matchTeam.team.id, name: matchTeam.team.name });
    if (query.eventId !== undefined && match.stageTag) stageTags.set(match.stageTag.id, { id: match.stageTag.id, eventId: match.stageTag.eventId, label: match.stageTag.label });
  }

  return {
    items: matches.map((match) => {
      const home = match.teams.find((team) => team.role === MatchTeamRole.HOME)!;
      const away = match.teams.find((team) => team.role === MatchTeamRole.AWAY)!;
      return {
        id: match.id,
        playedAt: match.playedAt.toISOString(),
        event: { id: match.event.id, slug: match.event.slug, name: match.event.name },
        stageTag: match.stageTag ? { id: match.stageTag.id, slug: match.stageTag.slug, label: match.stageTag.label } : null,
        homeTeam: { ...teamSummary(home.team), score: scoreFor(match, home.teamId) },
        awayTeam: { ...teamSummary(away.team), score: scoreFor(match, away.teamId) }
      };
    }),
    pagination: { page: query.page, pageSize: query.pageSize, totalItems, totalPages: Math.ceil(totalItems / query.pageSize) },
    filterOptions: {
      events: allVisibleEvents.map(({ event }) => event).sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id),
      teams: [...teams.values()].sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id),
      stageTags: [...stageTags.values()].sort((a, b) => a.label.localeCompare(b.label) || a.id - b.id)
    }
  };
}

export async function getMatchFormOptions(eventId?: number) {
  const events = await prisma.event.findMany({
    where: { status: { in: [EventStatus.ONGOING, EventStatus.COMPLETED] }, archivedAt: null, deletedAt: null },
    select: { id: true, name: true, status: true },
    orderBy: [{ rankingOrder: "asc" }, { id: "asc" }]
  });
  if (eventId === undefined) return { events, selectedEvent: null };
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      stageTags: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      participants: {
        where: { team: { archivedAt: null } },
        include: { team: { include: { players: { where: { isActive: true }, orderBy: [{ number: "asc" }, { name: "asc" }, { id: "asc" }] } } } }
      }
    }
  });
  if (!event) notFound("EVENT");
  if (!eventAvailable(event)) throw new ApiError(422, "EVENT_NOT_AVAILABLE_FOR_MATCH", "Event is not available for matches.");
  return {
    events,
    selectedEvent: {
      id: event.id,
      name: event.name,
      status: event.status,
      stageTags: event.stageTags.map((tag) => ({ id: tag.id, label: tag.label, sortOrder: tag.sortOrder })),
      teams: event.participants.map(({ team }) => ({
        id: team.id,
        slug: team.slug,
        name: team.name,
        primaryColor: team.primaryColor,
        players: team.players.map((player) => ({ id: player.id, slug: player.slug, name: player.name, number: player.number, position: player.position }))
      })).sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id)
    }
  };
}

export async function getMatchById(id: number) {
  const match = await findDetail(id);
  if (!match) notFound("MATCH");
  return serializeDetail(match);
}

type ValidationContext = {
  event: NonNullable<Awaited<ReturnType<typeof prisma.event.findUnique>>>;
  stageTag: Awaited<ReturnType<typeof prisma.eventStageTag.findUnique>>;
  teams: Awaited<ReturnType<typeof prisma.team.findMany>>;
  players: Awaited<ReturnType<typeof prisma.player.findMany>>;
  participantIds: Set<number>;
};

async function loadContext(eventId: number, input: MatchInput): Promise<ValidationContext> {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) notFound("EVENT");
  const stageTag = input.stageTagId === null ? null : await prisma.eventStageTag.findUnique({ where: { id: input.stageTagId } });
  if (input.stageTagId !== null && !stageTag) notFound("STAGE_TAG");
  const requestedTeamIds = input.teams.map((team) => team.teamId);
  const teams = await prisma.team.findMany({ where: { id: { in: requestedTeamIds } } });
  for (const teamInput of input.teams) if (!teams.some((team) => team.id === teamInput.teamId)) notFound("TEAM");
  const requestedPlayerIds = input.teams.flatMap((team) => team.playerStats.map((stat) => stat.playerId));
  const players = await prisma.player.findMany({ where: { id: { in: requestedPlayerIds } } });
  for (const teamInput of input.teams) {
    for (const stat of teamInput.playerStats) if (!players.some((player) => player.id === stat.playerId)) notFound("PLAYER");
  }
  const participants = await prisma.eventParticipant.findMany({ where: { eventId, teamId: { in: requestedTeamIds } }, select: { teamId: true } });
  return { event, stageTag, teams, players, participantIds: new Set(participants.map(({ teamId }) => teamId)) };
}

function validateBusiness(input: MatchInput, context: ValidationContext, mode: "create" | "patch", existing?: MatchDetailRecord) {
  if (!eventAvailable(context.event)) throw new ApiError(422, "EVENT_NOT_AVAILABLE_FOR_MATCH", "Event is not available for matches.");
  if (mode === "create") {
    const archived = input.teams.find((teamInput) => context.teams.find((team) => team.id === teamInput.teamId)?.archivedAt);
    if (archived) throw new ApiError(422, "TEAM_ARCHIVED", "Archived team cannot be used for a new match.", [{ field: `teams[${archived.index}].teamId`, message: "team is archived" }]);
  }
  const nonParticipant = input.teams.find((team) => !context.participantIds.has(team.teamId));
  if (nonParticipant) throw new ApiError(422, "TEAM_NOT_EVENT_PARTICIPANT", "Team is not an event participant.", [{ field: `teams[${nonParticipant.index}].teamId`, message: "team is not an event participant" }]);
  if (context.stageTag && context.stageTag.eventId !== context.event.id) throw new ApiError(422, "STAGE_TAG_EVENT_MISMATCH", "Stage tag does not belong to event.", [{ field: "stageTagId", message: "stage tag does not belong to event" }]);

  for (const teamInput of input.teams) {
    const team = context.teams.find((candidate) => candidate.id === teamInput.teamId)!;
    const existingIds = new Set(existing?.playerStats.filter((stat) => stat.teamId === teamInput.teamId).map((stat) => stat.playerId) ?? []);
    for (const statInput of teamInput.playerStats) {
      const player = context.players.find((candidate) => candidate.id === statInput.playerId)!;
      const field = `teams[${teamInput.index}].playerStats[${statInput.index}].playerId`;
      if (player.teamId !== teamInput.teamId) throw new ApiError(422, "PLAYER_TEAM_MISMATCH", "Player does not belong to team.", [{ field, message: "player does not belong to team" }]);
      const isNew = !existingIds.has(player.id);
      if (mode === "patch" && team.archivedAt && isNew) throw new ApiError(422, "TEAM_ARCHIVED", "Players cannot be added to an archived team.", [{ field, message: "cannot add a player to an archived team" }]);
      if ((mode === "create" || isNew) && !player.isActive) throw new ApiError(422, "PLAYER_INACTIVE", "Inactive player cannot be added.", [{ field, message: "player is inactive" }]);
    }
  }
  const [first, second] = input.teams;
  const score = (team: MatchTeamInput) => team.playerStats.reduce((sum, stat) => sum + stat.points, 0) + team.otherStats.points;
  if (first && second && score(first) === score(second)) throw new ApiError(422, "MATCH_SCORE_TIED", "Final scores cannot be tied.", [{ field: "form", message: "home and away scores must not be tied" }]);
}

function playerRows(matchId: number, team: MatchTeamInput) {
  return team.playerStats.map((stat) => ({
    matchId,
    teamId: team.teamId,
    playerId: stat.playerId,
    points: stat.points,
    rebounds: stat.rebounds,
    assists: stat.assists,
    fieldGoalsMade: stat.fieldGoalsMade,
    fieldGoalsAttempted: stat.fieldGoalsAttempted,
    threePointersMade: stat.threePointersMade,
    threePointersAttempted: stat.threePointersAttempted,
    minutes: stat.minutes,
    rating: stat.rating
  }));
}

function otherRow(matchId: number, team: MatchTeamInput) {
  return { matchId, teamId: team.teamId, ...team.otherStats };
}

export async function createMatch(input: MatchInput) {
  const eventId = input.eventId!;
  const context = await loadContext(eventId, input);
  validateBusiness(input, context, "create");
  const id = await prisma.$transaction(async (tx) => {
    const match = await tx.match.create({ data: { eventId, stageTagId: input.stageTagId, playedAt: input.playedAt }, select: { id: true } });
    await tx.matchTeam.createMany({ data: input.teams.map((team) => ({ matchId: match.id, teamId: team.teamId, role: team.role })) });
    await tx.matchPlayerStat.createMany({ data: input.teams.flatMap((team) => playerRows(match.id, team)) });
    await tx.matchTeamOtherStat.createMany({ data: input.teams.map((team) => otherRow(match.id, team)) });
    return match.id;
  });
  return getMatchById(id);
}

export async function updateMatch(id: number, input: MatchInput) {
  const existing = await findDetail(id);
  if (!existing) notFound("MATCH");
  if (existing.voidedAt) throw new ApiError(422, "MATCH_VOIDED", "Voided match cannot be edited.");
  const existingByRole = new Map(existing.teams.map((team) => [team.role, team.teamId]));
  const immutable = input.teams.find((team) => existingByRole.get(team.role) !== team.teamId);
  if (immutable) throw new ApiError(422, "MATCH_TEAM_IMMUTABLE", "Match teams and roles cannot be changed.", [{ field: `teams[${immutable.index}]`, message: "team and role are immutable" }]);
  const context = await loadContext(existing.eventId, input);
  validateBusiness(input, context, "patch", existing);
  await prisma.$transaction(async (tx) => {
    await tx.match.update({ where: { id }, data: { stageTagId: input.stageTagId, playedAt: input.playedAt } });
    await tx.matchPlayerStat.deleteMany({ where: { matchId: id } });
    await tx.matchTeamOtherStat.deleteMany({ where: { matchId: id } });
    await tx.matchPlayerStat.createMany({ data: input.teams.flatMap((team) => playerRows(id, team)) });
    await tx.matchTeamOtherStat.createMany({ data: input.teams.map((team) => otherRow(id, team)) });
  });
  return getMatchById(id);
}

export async function voidMatch(id: number) {
  const match = await prisma.match.findUnique({ where: { id }, select: { id: true, voidedAt: true } });
  if (!match) notFound("MATCH");
  if (match.voidedAt) throw new ApiError(422, "MATCH_ALREADY_VOIDED", "Match is already voided.");
  const updated = await prisma.match.update({ where: { id }, data: { voidedAt: new Date() }, select: { id: true, voidedAt: true } });
  return { id: updated.id, voidedAt: updated.voidedAt!.toISOString() };
}

export async function restoreMatch(id: number) {
  const match = await findDetail(id);
  if (!match) notFound("MATCH");
  if (!match.voidedAt) throw new ApiError(422, "MATCH_NOT_VOIDED", "Match is not voided.");
  const details: ErrorDetail[] = [];
  if (!eventAvailable(match.event)) details.push({ field: "event", message: "event is not available for matches" });
  const participants = await prisma.eventParticipant.findMany({ where: { eventId: match.eventId, teamId: { in: match.teams.map((team) => team.teamId) } }, select: { teamId: true } });
  const participantIds = new Set(participants.map(({ teamId }) => teamId));
  [...match.teams].sort((a, b) => a.role === MatchTeamRole.HOME ? -1 : b.role === MatchTeamRole.HOME ? 1 : 0).forEach((team, index) => {
    if (!participantIds.has(team.teamId)) details.push({ field: `teams[${index}].teamId`, message: "team is no longer an event participant" });
  });
  if (match.stageTagId !== null && match.stageTag?.eventId !== match.eventId) details.push({ field: "stageTagId", message: "stage tag no longer belongs to event" });
  if (details.length) throw new ApiError(422, "MATCH_RESTORE_NOT_ALLOWED", "Match cannot be restored.", details);
  await prisma.match.update({ where: { id }, data: { voidedAt: null } });
  return getMatchById(id);
}
