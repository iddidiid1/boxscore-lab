import { EventStatus, PlayerAwardType, Prisma } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import { ApiError, type ErrorDetail } from "../../shared/errors/api-error.js";
import { generateUniqueSlug, toSlugBase } from "../../shared/utils/slug.js";
import {
  parseEventInput,
  parseOutcomesInput,
  type EventInput,
  type PlayerAwardInput,
  type TagInput,
  type TeamResultInput
} from "./events.validation.js";

type Client = Prisma.TransactionClient;

const detailInclude = {
  participants: { include: { team: { include: { division: true } } } },
  stageTags: true,
  resultTags: true,
  teamResults: { include: { team: true, resultTag: true } },
  playerAwards: { include: { team: true, player: true } }
} satisfies Prisma.EventInclude;

type EventDetailRecord = Prisma.EventGetPayload<{ include: typeof detailInclude }>;

function api(status: number, code: string, message: string, details: ErrorDetail[] = []): never {
  throw new ApiError(status, code, message, details);
}

function iso(value: Date | null) {
  return value?.toISOString() ?? null;
}

function compareText(left: string, right: string) {
  return left.localeCompare(right);
}

function awardOrder(type: PlayerAwardType) {
  return type === PlayerAwardType.EVENT_MVP ? 0 : type === PlayerAwardType.ALL_EVENT_FIRST_TEAM ? 1 : 2;
}

async function findEvent(client: typeof prisma | Client, slug: string) {
  const event = await client.event.findFirst({ where: { slug, deletedAt: null }, include: detailInclude });
  if (!event) api(404, "EVENT_NOT_FOUND", "Event not found.");
  return event;
}

async function serializeEvent(event: EventDetailRecord) {
  const participantTeamIds = event.participants.map((participant) => participant.teamId);
  const candidates = participantTeamIds.length
    ? await prisma.player.findMany({
        where: { teamId: { in: participantTeamIds }, isActive: true },
        include: { team: true }
      })
    : [];

  const participants = event.participants
    .map(({ team }) => ({
      teamId: team.id,
      teamSlug: team.slug,
      teamName: team.name,
      teamArchivedAt: iso(team.archivedAt),
      divisionId: team.divisionId,
      divisionName: team.division?.name ?? null,
      isEligible: team.archivedAt === null && team.divisionId !== null && team.division !== null
    }))
    .sort((a, b) => compareText(a.teamName, b.teamName) || a.teamId - b.teamId);

  return {
    id: event.id,
    slug: event.slug,
    name: event.name,
    tier: event.tier,
    status: event.status,
    description: event.description,
    countsForRanking: event.countsForRanking,
    rankingOrder: event.rankingOrder,
    archivedAt: iso(event.archivedAt),
    deletedAt: iso(event.deletedAt),
    participants,
    awardCandidatePlayers: candidates
      .map((player) => ({
        playerId: player.id,
        playerSlug: player.slug,
        playerName: player.name,
        number: player.number,
        position: player.position,
        teamId: player.team.id,
        teamSlug: player.team.slug,
        teamName: player.team.name
      }))
      .sort((a, b) => compareText(a.teamName, b.teamName) || a.number - b.number || compareText(a.playerName, b.playerName) || a.playerId - b.playerId),
    stageTags: event.stageTags
      .map((tag) => ({ id: tag.id, slug: tag.slug, label: tag.label, description: tag.description, sortOrder: tag.sortOrder }))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    resultTags: event.resultTags
      .map((tag) => ({ id: tag.id, slug: tag.slug, label: tag.label, isWinnerTag: tag.isWinnerTag, rankingPoints: tag.rankingPoints, sortOrder: tag.sortOrder }))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    teamResults: event.teamResults
      .map((result) => ({
        id: result.id,
        teamId: result.teamId,
        teamSlug: result.team.slug,
        teamName: result.team.name,
        resultTagId: result.resultTagId,
        resultTagLabel: result.resultTag.label,
        notes: result.notes,
        sortOrder: result.resultTag.sortOrder,
        rankingPoints: result.resultTag.rankingPoints
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder || b.rankingPoints - a.rankingPoints || compareText(a.teamName, b.teamName) || a.teamId - b.teamId)
      .map(({ sortOrder: _sortOrder, rankingPoints: _rankingPoints, ...result }) => result),
    playerAwards: event.playerAwards
      .map((award) => ({
        id: award.id,
        awardType: award.awardType,
        playerId: award.playerId,
        playerSlug: award.player.slug,
        playerName: award.player.name,
        playerIsActive: award.player.isActive,
        playerNumber: award.player.number,
        teamId: award.teamId,
        teamSlug: award.team.slug,
        teamName: award.team.name,
        notes: award.notes
      }))
      .sort((a, b) => awardOrder(a.awardType) - awardOrder(b.awardType) || compareText(a.teamName, b.teamName) || a.playerNumber - b.playerNumber || compareText(a.playerName, b.playerName) || a.playerId - b.playerId)
      .map(({ playerNumber: _playerNumber, ...award }) => award),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString()
  };
}

async function detailBySlug(slug: string) {
  return serializeEvent(await findEvent(prisma, slug));
}

export async function listActiveEvents() {
  const events = await prisma.event.findMany({
    where: { archivedAt: null, deletedAt: null },
    include: {
      participants: { select: { id: true } },
      teamResults: { where: { resultTag: { isWinnerTag: true } }, include: { team: true, resultTag: true } }
    },
    orderBy: [{ rankingOrder: "desc" }, { id: "desc" }]
  });
  return {
    events: events.map((event) => {
      const champion = event.teamResults[0];
      return {
        id: event.id,
        slug: event.slug,
        name: event.name,
        tier: event.tier,
        status: event.status,
        description: event.description,
        countsForRanking: event.countsForRanking,
        rankingOrder: event.rankingOrder,
        participatingTeamCount: event.participants.length,
        champion: champion ? {
          teamId: champion.teamId,
          teamSlug: champion.team.slug,
          teamName: champion.team.name,
          resultTagId: champion.resultTagId,
          resultTagLabel: champion.resultTag.label
        } : null,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString()
      };
    })
  };
}

export async function getEventBySlug(slug: string) {
  return detailBySlug(slug);
}

function tagSlugs(tags: TagInput[], field: "stageTags" | "resultTags") {
  const seen = new Map<string, number>();
  const details: ErrorDetail[] = [];
  const slugs = tags.map((tag) => {
    const slug = toSlugBase(tag.label) ?? (field === "stageTags" ? "stage" : "result");
    const first = seen.get(slug);
    if (first !== undefined) details.push({ field: `${field}[${tag.index}].label`, message: `generates the same slug as ${field}[${first}].label` });
    else seen.set(slug, tag.index);
    return slug;
  });
  if (details.length) api(400, "VALIDATION_ERROR", "Request validation failed.", details);
  return slugs;
}

async function validateNewTeams(client: Client, ids: number[], existingIds = new Set<number>()) {
  if (!ids.length) return;
  const teams = await client.team.findMany({ where: { id: { in: ids } }, include: { division: true } });
  const byId = new Map(teams.map((team) => [team.id, team]));
  for (const [index, id] of ids.entries()) {
    if (existingIds.has(id)) continue;
    const team = byId.get(id);
    if (!team) api(404, "TEAM_NOT_FOUND", "Team not found.", [{ field: `participantTeamIds[${index}]`, message: "team not found" }]);
    if (team.archivedAt) api(422, "TEAM_ARCHIVED", "Archived team cannot be added.", [{ field: `participantTeamIds[${index}]`, message: "team is archived" }]);
    if (!team.divisionId || !team.division) api(422, "ACTIVE_TEAM_REQUIRES_DIVISION", "Active team requires a division.", [{ field: `participantTeamIds[${index}]`, message: "team requires a valid division" }]);
  }
}

async function createConfiguration(client: Client, eventId: number, input: EventInput) {
  const participantIds = input.participantTeamIds ?? [];
  await validateNewTeams(client, participantIds);
  if (participantIds.length) await client.eventParticipant.createMany({ data: participantIds.map((teamId) => ({ eventId, teamId })) });
  if (input.stageTags?.length) {
    const slugs = tagSlugs(input.stageTags, "stageTags");
    await client.eventStageTag.createMany({ data: input.stageTags.map((tag, index) => ({ eventId, slug: slugs[index], label: tag.label, description: tag.description, sortOrder: tag.sortOrder })) });
  }
  if (input.resultTags?.length) {
    const slugs = tagSlugs(input.resultTags, "resultTags");
    await client.eventResultTag.createMany({ data: input.resultTags.map((tag, index) => ({ eventId, slug: slugs[index], label: tag.label, isWinnerTag: tag.isWinnerTag ?? false, rankingPoints: tag.rankingPoints ?? 0, sortOrder: tag.sortOrder })) });
  }
}

export async function createEventWithConfiguration(body: unknown) {
  const input = parseEventInput(body, "create");
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const slug = await generateUniqueSlug(prisma, "event", input.name ?? "", "event");
    try {
      await prisma.$transaction(async (client) => {
        const latest = await client.event.aggregate({ _max: { rankingOrder: true } });
        const event = await client.event.create({
          data: {
            slug,
            name: input.name ?? "",
            tier: input.tier!,
            status: EventStatus.PREPARING,
            description: input.description,
            countsForRanking: input.countsForRanking ?? true,
            rankingOrder: (latest._max.rankingOrder ?? 0) + 1
          }
        });
        await createConfiguration(client, event.id, input);
      });
      return detailBySlug(slug);
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
      if (attempt === 1) {
        const target = JSON.stringify(error.meta?.target ?? "");
        if (target.includes("rankingOrder")) api(409, "RANKING_ORDER_CONFLICT", "Unable to allocate ranking order.");
        api(409, "SLUG_CONFLICT", "Unable to generate a unique slug.");
      }
    }
  }
  api(409, "RANKING_ORDER_CONFLICT", "Unable to create event.");
}

function ensureMutable(event: EventDetailRecord) {
  if (event.archivedAt) api(422, "EVENT_ARCHIVED", "Archived event cannot be modified.");
}

function validateTransition(current: EventStatus, next: EventStatus) {
  if (current === next) api(409, "INVALID_EVENT_STATUS_TRANSITION", "Event status must change.");
  const allowed = (current === EventStatus.PREPARING && next === EventStatus.ONGOING)
    || (current === EventStatus.ONGOING && next === EventStatus.COMPLETED)
    || (current === EventStatus.COMPLETED && next === EventStatus.ONGOING);
  if (!allowed) api(409, "INVALID_EVENT_STATUS_TRANSITION", "Event status transition is not allowed.");
}

async function replaceStageTags(client: Client, event: EventDetailRecord, tags: TagInput[]) {
  const existingById = new Map(event.stageTags.map((tag) => [tag.id, tag]));
  for (const tag of tags) if (tag.id && !existingById.has(tag.id)) api(404, "STAGE_TAG_NOT_FOUND", "Stage tag not found.", [{ field: `stageTags[${tag.index}].id`, message: "stage tag does not belong to event" }]);
  const keep = new Set(tags.flatMap((tag) => tag.id ? [tag.id] : []));
  const removed = event.stageTags.filter((tag) => !keep.has(tag.id));
  if (removed.length) {
    const used = await client.match.findFirst({ where: { stageTagId: { in: removed.map((tag) => tag.id) } }, select: { stageTagId: true } });
    if (used) api(409, "STAGE_TAG_IN_USE", "Stage tag is used by a match.");
  }
  const proposedSlugs = tags.map((tag) => tag.id ? existingById.get(tag.id)!.slug : (toSlugBase(tag.label) ?? "stage"));
  const duplicate = proposedSlugs.findIndex((slug, index) => proposedSlugs.indexOf(slug) !== index);
  if (duplicate >= 0) api(400, "VALIDATION_ERROR", "Request validation failed.", [{ field: `stageTags[${duplicate}].label`, message: "duplicate stage tag slug" }]);
  if (removed.length) await client.eventStageTag.deleteMany({ where: { id: { in: removed.map((tag) => tag.id) } } });
  for (const [index, tag] of tags.entries()) {
    if (tag.id) await client.eventStageTag.update({ where: { id: tag.id }, data: { label: tag.label, description: tag.description, sortOrder: tag.sortOrder } });
    else await client.eventStageTag.create({ data: { eventId: event.id, slug: proposedSlugs[index], label: tag.label, description: tag.description, sortOrder: tag.sortOrder } });
  }
}

async function replaceResultTags(client: Client, event: EventDetailRecord, tags: TagInput[]) {
  const existingById = new Map(event.resultTags.map((tag) => [tag.id, tag]));
  for (const tag of tags) if (tag.id && !existingById.has(tag.id)) api(404, "RESULT_TAG_NOT_FOUND", "Result tag not found.", [{ field: `resultTags[${tag.index}].id`, message: "result tag does not belong to event" }]);
  const keep = new Set(tags.flatMap((tag) => tag.id ? [tag.id] : []));
  const removed = event.resultTags.filter((tag) => !keep.has(tag.id));
  if (removed.length) {
    const used = await client.eventTeamResult.findFirst({ where: { resultTagId: { in: removed.map((tag) => tag.id) } } });
    if (used) api(409, "RESULT_TAG_IN_USE", "Result tag is used by an event result.");
  }
  const slugs = tags.map((tag) => tag.id ? existingById.get(tag.id)!.slug : (toSlugBase(tag.label) ?? "result"));
  const duplicate = slugs.findIndex((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicate >= 0) api(400, "VALIDATION_ERROR", "Request validation failed.", [{ field: `resultTags[${duplicate}].label`, message: "duplicate result tag slug" }]);
  const winnerIds = new Set(tags.filter((tag) => tag.isWinnerTag).flatMap((tag) => tag.id ? [tag.id] : []));
  const championCount = event.teamResults.filter((result) => winnerIds.has(result.resultTagId)).length;
  if (championCount > 1) api(409, "CHAMPION_RESULT_CONFLICT", "Multiple teams would become champion.");
  if (removed.length) await client.eventResultTag.deleteMany({ where: { id: { in: removed.map((tag) => tag.id) } } });
  for (const [index, tag] of tags.entries()) {
    const data = { label: tag.label, isWinnerTag: tag.isWinnerTag ?? false, rankingPoints: tag.rankingPoints ?? 0, sortOrder: tag.sortOrder };
    if (tag.id) await client.eventResultTag.update({ where: { id: tag.id }, data });
    else await client.eventResultTag.create({ data: { eventId: event.id, slug: slugs[index], ...data } });
  }
}

async function replaceParticipants(client: Client, event: EventDetailRecord, ids: number[]) {
  const existing = new Set(event.participants.map((participant) => participant.teamId));
  await validateNewTeams(client, ids, existing);
  const removed = [...existing].filter((id) => !ids.includes(id));
  for (const teamId of removed) {
    const [match, result, award] = await Promise.all([
      client.match.findFirst({ where: { eventId: event.id, teams: { some: { teamId } } }, select: { id: true } }),
      client.eventTeamResult.findFirst({ where: { eventId: event.id, teamId }, select: { id: true } }),
      client.eventPlayerAward.findFirst({ where: { eventId: event.id, teamId }, select: { id: true } })
    ]);
    if (match || result || award) api(409, "EVENT_PARTICIPANT_IN_USE", "Participant has historical references.");
  }
  if (removed.length) await client.eventParticipant.deleteMany({ where: { eventId: event.id, teamId: { in: removed } } });
  const added = ids.filter((id) => !existing.has(id));
  if (added.length) await client.eventParticipant.createMany({ data: added.map((teamId) => ({ eventId: event.id, teamId })) });
}

export async function updateEventBySlug(slug: string, body: unknown) {
  const input = parseEventInput(body, "patch");
  await prisma.$transaction(async (client) => {
    const event = await findEvent(client, slug);
    ensureMutable(event);
    if (event.status === EventStatus.COMPLETED) {
      if (Object.keys(body as object).length !== 1 || input.status !== EventStatus.ONGOING) api(409, "EVENT_COMPLETED", "Completed event must be reopened before editing.");
    }
    if (input.status) validateTransition(event.status, input.status);
    if (input.stageTags) await replaceStageTags(client, event, input.stageTags);
    if (input.resultTags) await replaceResultTags(client, event, input.resultTags);
    if (input.participantTeamIds) await replaceParticipants(client, event, input.participantTeamIds);
    const finalParticipantCount = input.participantTeamIds?.length ?? event.participants.length;
    if (input.status === EventStatus.ONGOING && event.status === EventStatus.PREPARING && finalParticipantCount === 0) api(409, "EVENT_PARTICIPANTS_REQUIRED", "Event requires at least one participant.");
    if (input.status === EventStatus.COMPLETED) {
      if (finalParticipantCount === 0) api(409, "EVENT_PARTICIPANTS_REQUIRED", "Event requires at least one participant.");
      const resultCount = await client.eventTeamResult.count({ where: { eventId: event.id, teamId: { in: input.participantTeamIds ?? event.participants.map((participant) => participant.teamId) } } });
      if (resultCount !== finalParticipantCount) api(409, "EVENT_RESULTS_INCOMPLETE", "Every participant requires a result.");
    }
    await client.event.update({
      where: { id: event.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.tier !== undefined ? { tier: input.tier } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.countsForRanking !== undefined ? { countsForRanking: input.countsForRanking } : {})
      }
    });
  });
  return detailBySlug(slug);
}

function validateAwardLimits(awards: PlayerAwardInput[]) {
  const limits = new Map<PlayerAwardType, number>([[PlayerAwardType.EVENT_MVP, 1], [PlayerAwardType.ALL_EVENT_FIRST_TEAM, 5], [PlayerAwardType.ALL_EVENT_SECOND_TEAM, 5]]);
  for (const [type, limit] of limits) if (awards.filter((award) => award.awardType === type).length > limit) api(409, "AWARD_LIMIT_EXCEEDED", "Award limit exceeded.");
  const first = new Set(awards.filter((award) => award.awardType === PlayerAwardType.ALL_EVENT_FIRST_TEAM).map((award) => award.playerId));
  const conflict = awards.find((award) => award.awardType === PlayerAwardType.ALL_EVENT_SECOND_TEAM && first.has(award.playerId));
  if (conflict) api(409, "AWARD_TEAM_CONFLICT", "A player cannot be on both event teams.", [{ field: `playerAwards[${conflict.index}].playerId`, message: "player is already on the first team" }]);
}

async function replaceTeamResults(client: Client, event: EventDetailRecord, results: TeamResultInput[]) {
  const participants = new Set(event.participants.map((participant) => participant.teamId));
  const tags = new Map(event.resultTags.map((tag) => [tag.id, tag]));
  let winnerCount = 0;
  for (const result of results) {
    if (!participants.has(result.teamId)) api(422, "TEAM_NOT_IN_EVENT", "Team is not an event participant.", [{ field: `teamResults[${result.index}].teamId`, message: "team is not in event" }]);
    const tag = tags.get(result.resultTagId);
    if (!tag) api(404, "RESULT_TAG_NOT_FOUND", "Result tag not found.", [{ field: `teamResults[${result.index}].resultTagId`, message: "result tag does not belong to event" }]);
    if (tag.isWinnerTag) winnerCount += 1;
  }
  if (winnerCount > 1) api(409, "CHAMPION_RESULT_CONFLICT", "Only one champion is allowed.");
  await client.eventTeamResult.deleteMany({ where: { eventId: event.id } });
  if (results.length) await client.eventTeamResult.createMany({ data: results.map((result) => ({ eventId: event.id, teamId: result.teamId, resultTagId: result.resultTagId, notes: result.notes })) });
}

async function replacePlayerAwards(client: Client, event: EventDetailRecord, awards: PlayerAwardInput[]) {
  validateAwardLimits(awards);
  const participants = new Set(event.participants.map((participant) => participant.teamId));
  const players = await client.player.findMany({ where: { id: { in: awards.map((award) => award.playerId) } } });
  const byId = new Map(players.map((player) => [player.id, player]));
  const existing = new Map(event.playerAwards.map((award) => [`${award.playerId}:${award.awardType}`, award]));
  for (const award of awards) {
    const player = byId.get(award.playerId);
    if (!player) api(404, "PLAYER_NOT_FOUND", "Player not found.", [{ field: `playerAwards[${award.index}].playerId`, message: "player not found" }]);
    if (player.teamId !== award.teamId || !participants.has(award.teamId)) api(422, "PLAYER_NOT_IN_EVENT", "Player is not in this event.", [{ field: `playerAwards[${award.index}].playerId`, message: "player is not in event" }]);
    if (!player.isActive) {
      const prior = existing.get(`${award.playerId}:${award.awardType}`);
      if (!prior || prior.teamId !== award.teamId || prior.notes !== (award.notes ?? null)) api(422, "PLAYER_INACTIVE", "Inactive player award can only be retained unchanged.", [{ field: `playerAwards[${award.index}].playerId`, message: "inactive player cannot receive a new or changed award" }]);
    }
  }
  await client.eventPlayerAward.deleteMany({ where: { eventId: event.id } });
  if (awards.length) await client.eventPlayerAward.createMany({ data: awards.map((award) => ({ eventId: event.id, awardType: award.awardType, playerId: award.playerId, teamId: award.teamId, notes: award.notes })) });
}

export async function updateEventOutcomesBySlug(slug: string, body: unknown) {
  const input = parseOutcomesInput(body);
  await prisma.$transaction(async (client) => {
    const event = await findEvent(client, slug);
    ensureMutable(event);
    if (event.status === EventStatus.COMPLETED) api(409, "EVENT_COMPLETED", "Completed event must be reopened before editing outcomes.");
    if (input.teamResults) await replaceTeamResults(client, event, input.teamResults);
    if (input.playerAwards) await replacePlayerAwards(client, event, input.playerAwards);
  });
  return detailBySlug(slug);
}

export async function archiveEventBySlug(slug: string) {
  const event = await prisma.event.findFirst({ where: { slug, deletedAt: null }, select: { id: true, slug: true, archivedAt: true } });
  if (!event) api(404, "EVENT_NOT_FOUND", "Event not found.");
  if (event.archivedAt) api(422, "EVENT_ALREADY_ARCHIVED", "Event is already archived.");
  const archived = await prisma.event.update({ where: { id: event.id }, data: { archivedAt: new Date() }, select: { id: true, slug: true, archivedAt: true } });
  return { id: archived.id, slug: archived.slug, archivedAt: iso(archived.archivedAt) };
}
