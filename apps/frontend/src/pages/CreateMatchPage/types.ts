import type { PlayerPosition } from "../../shared/utils/playerSorting";

export const MATCH_OTHER_PLAYER_ID = "__match_other__";

export type MatchFormEvent = {
  id: string;
  name: string;
  tags: string[];
};

export type MatchFormPlayer = {
  id: string;
  position: PlayerPosition;
  name: string;
};

export type MatchFormTeam = {
  id: string;
  name: string;
  color: string;
  players: MatchFormPlayer[];
};

export type PlayerStatInput = {
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

export type PlayerStatsById = Record<string, PlayerStatInput>;
