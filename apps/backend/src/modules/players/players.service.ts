import { EventStatus, PlayerPosition, Prisma } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import { PLAYER_POSITION_ORDER } from "../../shared/constants/player-positions.js";
import { ApiError } from "../../shared/errors/api-error.js";
import type { PlayerDetailQuery, PlayerListQuery, PlayerSortField } from "./players.validation.js";

const visibleEvent = { status: { in: [EventStatus.ONGOING, EventStatus.COMPLETED] }, archivedAt: null, deletedAt: null };
const labels = { points: "Points Per Game", rebounds: "Rebounds Per Game", assists: "Assists Per Game", rating: "Player Rating" } as const;
type Totals = { gamesPlayed: number; points: number; rebounds: number; assists: number; fieldGoalsMade: number; fieldGoalsAttempted: number; threePointersMade: number; threePointersAttempted: number; minutes: number; rating: number };
const zeroTotals = (): Totals => ({ gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, fieldGoalsMade: 0, fieldGoalsAttempted: 0, threePointersMade: 0, threePointersAttempted: 0, minutes: 0, rating: 0 });
const one = (value: number) => Math.round(value * 10) / 10;
const percentage = (made: number, attempted: number) => attempted === 0 ? null : one(made / attempted * 100);
function stats(total: Totals) {
  if (!total.gamesPlayed) return { gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, fieldGoalPercentage: null, threePointPercentage: null, minutes: 0, rating: 0 };
  return { gamesPlayed: total.gamesPlayed, points: one(total.points / total.gamesPlayed), rebounds: one(total.rebounds / total.gamesPlayed), assists: one(total.assists / total.gamesPlayed), fieldGoalPercentage: percentage(total.fieldGoalsMade, total.fieldGoalsAttempted), threePointPercentage: percentage(total.threePointersMade, total.threePointersAttempted), minutes: one(total.minutes / total.gamesPlayed), rating: one(total.rating / total.gamesPlayed) };
}
function add(total: Totals, row: Omit<Totals, "gamesPlayed">) {
  total.gamesPlayed++;
  total.points += row.points;
  total.rebounds += row.rebounds;
  total.assists += row.assists;
  total.fieldGoalsMade += row.fieldGoalsMade;
  total.fieldGoalsAttempted += row.fieldGoalsAttempted;
  total.threePointersMade += row.threePointersMade;
  total.threePointersAttempted += row.threePointersAttempted;
  total.minutes += row.minutes;
  total.rating += row.rating;
}
function team(team: { id: number; slug: string; name: string; primaryColor: string | null }) { return { id: team.id, slug: team.slug, name: team.name, primaryColor: team.primaryColor }; }
function compareValue(a: number | null, b: number | null, direction: "asc" | "desc") { if (a === null) return b === null ? 0 : 1; if (b === null) return -1; return direction === "asc" ? a - b : b - a; }
function fallback(a: Aggregate, b: Aggregate) { return b.stats.gamesPlayed - a.stats.gamesPlayed || a.player.name.localeCompare(b.player.name) || a.player.id - b.player.id; }
type Aggregate = { player: { id: number; slug: string; name: string; number: number; position: PlayerPosition; team: { id: number; slug: string; name: string; primaryColor: string | null } }; stats: ReturnType<typeof stats> };
function aggregateRows(rows: Awaited<ReturnType<typeof loadStatRows>>) {
  const totals = new Map<number, Totals>();
  const players = new Map<number, Aggregate["player"]>();
  rows.forEach((row) => { const total = totals.get(row.playerId) ?? zeroTotals(); add(total, row); totals.set(row.playerId, total); players.set(row.playerId, { ...row.player, team: row.player.team }); });
  return [...totals].map(([id, total]) => ({ player: players.get(id)!, stats: stats(total) }));
}
function loadStatRows(eventId?: number, playerId?: number) {
  return prisma.matchPlayerStat.findMany({
    where: { ...(playerId ? { playerId } : {}), match: { voidedAt: null, event: visibleEvent, ...(eventId ? { eventId } : {}) } },
    select: { playerId: true, points: true, rebounds: true, assists: true, fieldGoalsMade: true, fieldGoalsAttempted: true, threePointersMade: true, threePointersAttempted: true, minutes: true, rating: true, player: { select: { id: true, slug: true, name: true, number: true, position: true, team: { select: { id: true, slug: true, name: true, primaryColor: true } } } } }
  });
}
async function resources(eventId?: number, teamId?: number) {
  const [event, selectedTeam] = await Promise.all([eventId ? prisma.event.findUnique({ where: { id: eventId } }) : null, teamId ? prisma.team.findUnique({ where: { id: teamId } }) : null]);
  if (eventId && !event) throw new ApiError(404, "EVENT_NOT_FOUND", "event not found.");
  if (teamId && !selectedTeam) throw new ApiError(404, "TEAM_NOT_FOUND", "team not found.");
  return { event, selectedTeam };
}
function candidate(aggregate: Aggregate, query: Pick<PlayerListQuery, "teamId" | "position">, participantIds?: Set<number>) { return aggregate.player.team && aggregate.player.team.id === (query.teamId ?? aggregate.player.team.id) && (!query.position || aggregate.player.position === query.position) && (!participantIds || participantIds.has(aggregate.player.team.id)); }
async function eligibleAggregates(eventId?: number) {
  const rows = await loadStatRows(eventId);
  const activeIds = new Set((await prisma.player.findMany({ where: { isActive: true, team: { archivedAt: null } }, select: { id: true } })).map(({ id }) => id));
  return aggregateRows(rows).filter((item) => activeIds.has(item.player.id));
}

export async function listPlayers(query: PlayerListQuery) {
  const { event } = await resources(query.eventId, query.teamId);
  const available = !event || ((event.status === EventStatus.ONGOING || event.status === EventStatus.COMPLETED) && !event.archivedAt && !event.deletedAt);
  const participantIds = query.eventId ? new Set((await prisma.eventParticipant.findMany({ where: { eventId: query.eventId }, select: { teamId: true } })).map(({ teamId }) => teamId)) : undefined;
  const all = available ? await eligibleAggregates(query.eventId) : [];
  const filtered = all.filter((item) => candidate(item, query, participantIds));
  const ordered = [...filtered].sort((a, b) => compareValue(a.stats[query.sortBy], b.stats[query.sortBy], query.sortDirection) || fallback(a, b));
  const totalItems = ordered.length, totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize)), page = Math.min(query.page, totalPages);
  const items = ordered.slice((page - 1) * query.pageSize, page * query.pageSize).map((item, index) => ({ rank: (page - 1) * query.pageSize + index + 1, id: item.player.id, slug: item.player.slug, name: item.player.name, number: item.player.number, position: item.player.position, team: team(item.player.team), stats: item.stats }));
  const leaders = (Object.keys(labels) as (keyof typeof labels)[]).map((stat) => { const winner = [...filtered].sort((a, b) => compareValue(a.stats[stat], b.stats[stat], "desc") || fallback(a, b))[0]; return { stat, label: labels[stat], value: winner?.stats[stat] ?? 0, player: winner ? { id: winner.player.id, slug: winner.player.slug, name: winner.player.name } : null, team: winner ? { id: winner.player.team.id, name: winner.player.team.name } : null }; });
  const events = await prisma.event.findMany({ where: visibleEvent, select: { id: true, name: true, status: true }, orderBy: [{ rankingOrder: "asc" }, { id: "asc" }] });
  const optionTeams = query.eventId ? await prisma.team.findMany({ where: { archivedAt: null, eventParticipants: { some: { eventId: query.eventId } } }, select: { id: true, name: true }, orderBy: [{ name: "asc" }, { id: "asc" }] }) : [...new Map(all.map((item) => [item.player.team.id, { id: item.player.team.id, name: item.player.team.name }])).values()].sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);
  const positionSource = all.filter((item) => (!query.teamId || item.player.team.id === query.teamId) && (!participantIds || participantIds.has(item.player.team.id)));
  return { items, leaders, pagination: { page, pageSize: query.pageSize, totalItems, totalPages }, filterOptions: { events, teams: optionTeams, positions: PLAYER_POSITION_ORDER.filter((position) => positionSource.some((item) => item.player.position === position)) } };
}

export async function getPlayerDetail(slug: string, query: PlayerDetailQuery) {
  const player = await prisma.player.findUnique({ where: { slug }, include: { team: true } });
  if (!player) throw new ApiError(404, "PLAYER_NOT_FOUND", "player not found.");
  const { event } = await resources(query.eventId);
  const available = !event || ((event.status === EventStatus.ONGOING || event.status === EventStatus.COMPLETED) && !event.archivedAt && !event.deletedAt);
  const playerRows = available ? await loadStatRows(query.eventId, player.id) : [];
  const playerStats = stats(aggregateRows(playerRows)[0] ? (() => { const t = zeroTotals(); playerRows.forEach((row) => add(t, row)); return t; })() : zeroTotals());
  const eligible = available ? await eligibleAggregates(query.eventId) : [];
  const performanceBars = (["points", "rebounds", "assists"] as const).map((stat) => { const maximum = Math.max(0, ...eligible.map((item) => item.stats[stat])); return { stat, label: stat[0].toUpperCase() + stat.slice(1), value: maximum ? Math.round(Math.min(100, playerStats[stat] / maximum * 100)) : 0 }; });
  const eventOptionsRaw = await prisma.matchPlayerStat.findMany({ where: { playerId: player.id, match: { voidedAt: null, event: visibleEvent } }, select: { match: { select: { event: { select: { id: true, name: true, status: true, rankingOrder: true } } } } } });
  const eventOptions = [...new Map(eventOptionsRaw.map(({ match }) => [match.event.id, match.event])).values()].sort((a, b) => a.rankingOrder - b.rankingOrder || a.id - b.id).map(({ rankingOrder: _, ...item }) => item);
  const awards = await prisma.eventPlayerAward.findMany({ where: { playerId: player.id, event: { archivedAt: null, deletedAt: null }, ...(query.eventId ? { eventId: query.eventId } : {}) }, include: { event: true, team: true }, orderBy: [{ eventId: "asc" }, { id: "asc" }] });
  const historyWhere: Prisma.MatchPlayerStatWhereInput = available ? { playerId: player.id, match: { voidedAt: null, event: visibleEvent, ...(query.eventId ? { eventId: query.eventId } : {}) } } : { id: -1 };
  const totalItems = await prisma.matchPlayerStat.count({ where: historyWhere });
  const totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize)), page = Math.min(query.page, totalPages);
  const history = await prisma.matchPlayerStat.findMany({ where: historyWhere, include: { team: true, match: { include: { event: true, stageTag: true, teams: { include: { team: true } } } } }, orderBy: [{ match: { playedAt: "desc" } }, { matchId: "desc" }], skip: (page - 1) * query.pageSize, take: query.pageSize });
  return { scope: { eventId: query.eventId ?? null, available }, player: { id: player.id, slug: player.slug, name: player.name, number: player.number, position: player.position, isActive: player.isActive, team: { ...team(player.team), archivedAt: player.team.archivedAt?.toISOString() ?? null } }, stats: playerStats, performanceBars, eventOptions, awards: awards.map((award) => ({ id: award.id, awardType: award.awardType, notes: award.notes, event: { id: award.event.id, slug: award.event.slug, name: award.event.name }, team: { id: award.team.id, slug: award.team.slug, name: award.team.name } })), matches: { items: history.map((row) => { const opponent = row.match.teams.find((item) => item.teamId !== row.teamId)?.team; if (!opponent) console.warn(`Player history data integrity warning: match ${row.matchId} has no opponent`); return { id: row.matchId, playedAt: row.match.playedAt.toISOString(), event: { id: row.match.event.id, slug: row.match.event.slug, name: row.match.event.name }, stageTag: row.match.stageTag ? { id: row.match.stageTag.id, slug: row.match.stageTag.slug, label: row.match.stageTag.label } : null, team: team(row.team), opponent: opponent ? team(opponent) : null, stats: { points: row.points, rebounds: row.rebounds, assists: row.assists, fieldGoalPercentage: percentage(row.fieldGoalsMade, row.fieldGoalsAttempted), threePointPercentage: percentage(row.threePointersMade, row.threePointersAttempted), minutes: row.minutes, rating: row.rating } }; }), pagination: { page, pageSize: query.pageSize, totalItems, totalPages } } };
}
