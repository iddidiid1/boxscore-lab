import type { PlayerPosition } from "../../shared/utils/playerSorting";

export type MatchDetailTeam = {
  id: string;
  name: string;
  color: string;
  score: number;
};

export type BoxScorePlayer = {
  id: string;
  teamId: string;
  position: PlayerPosition;
  name: string;
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalPercentage: number;
  threePointersMade: number;
  threePointersAttempted: number;
  threePointPercentage: number;
  minutes: number;
  rating: number;
};

export type BoxScoreOtherStats = {
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
};

export type MatchDetailRecord = {
  id: string;
  eventName: string;
  date: string;
  tags: string[];
  homeTeam: MatchDetailTeam;
  awayTeam: MatchDetailTeam;
  players: BoxScorePlayer[];
  otherStats: Record<string, BoxScoreOtherStats>;
};
