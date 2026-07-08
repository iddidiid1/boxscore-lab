
import type { ApiErrorResponse, PlayerPosition } from "../teams/types";

export type { ApiErrorResponse };

export type MatchRole = "HOME" | "AWAY";

export type MatchTeamSummary = {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  archivedAt?: string | null;
};

export type MatchListItem = {
  id: number;
  playedAt: string;
  event: { id: number; slug: string; name: string };
  stageTag: { id: number; slug: string; label: string } | null;
  homeTeam: MatchTeamSummary & { score: number };
  awayTeam: MatchTeamSummary & { score: number };
};

export type MatchFilterOptions = {
  events: Array<{ id: number; name: string }>;
  teams: Array<{ id: number; name: string }>;
  stageTags: Array<{ id: number; eventId: number; label: string }>;
};

export type MatchListResponse = {
  items: MatchListItem[];
  pagination: { page: number; pageSize: number; totalItems: number; totalPages: number };
  filterOptions: MatchFilterOptions;
};

export type MatchPlayerStat = {
  playerId: number;
  playerSlug: string;
  playerName: string;
  playerNumber: number;
  position: PlayerPosition;
  isActive: boolean;
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalPercentage: number | null;
  threePointersMade: number;
  threePointersAttempted: number;
  threePointPercentage: number | null;
  minutes: number;
  rating: number;
};

export type MatchOtherStats = Omit<MatchPlayerStat, "playerId" | "playerSlug" | "playerName" | "playerNumber" | "position" | "isActive" | "minutes" | "rating">;

export type MatchDetailTeam = {
  role: MatchRole;
  team: MatchTeamSummary & { archivedAt: string | null };
  score: number;
  playerStats: MatchPlayerStat[];
  otherStats: MatchOtherStats;
};

export type MatchDetail = {
  id: number;
  playedAt: string;
  voidedAt: string | null;
  event: { id: number; slug: string; name: string; status: "PREPARING" | "ONGOING" | "COMPLETED"; archivedAt: string | null; deletedAt: string | null };
  stageTag: { id: number; slug: string; label: string } | null;
  teams: [MatchDetailTeam, MatchDetailTeam];
  createdAt: string;
  updatedAt: string;
};

export type MatchFormPlayer = { id: number; slug: string; name: string; number: number; position: PlayerPosition };
export type MatchFormTeamOption = MatchTeamSummary & { players: MatchFormPlayer[] };
export type MatchFormEventOption = { id: number; name: string; status: "ONGOING" | "COMPLETED" };
export type MatchFormOptions = {
  events: MatchFormEventOption[];
  selectedEvent: null | (MatchFormEventOption & {
    stageTags: Array<{ id: number; label: string; sortOrder: number }>;
    teams: MatchFormTeamOption[];
  });
};

export type PlayerStatPayload = {
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
};

export type OtherStatPayload = Omit<PlayerStatPayload, "playerId" | "minutes" | "rating">;
export type MatchTeamPayload = { role: MatchRole; teamId: number; playerStats: PlayerStatPayload[]; otherStats: OtherStatPayload };
export type CreateMatchPayload = { eventId: number; stageTagId: number | null; playedAt: string; teams: MatchTeamPayload[] };
export type UpdateMatchPayload = Omit<CreateMatchPayload, "eventId">;
