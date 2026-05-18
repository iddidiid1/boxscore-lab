export type PlayerRanking = {
  id: string;
  rank: number;
  name: string;
  team: string;
  teamColor: string;
  position: string;
  points: number;
  assists: number;
  rebounds: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  rating: number;
};

export type PlayerRankingEventId = "season-total" | "regional-finals" | "city-classic";

export type PlayerRankingEventOption = {
  label: string;
  value: PlayerRankingEventId;
};

export type PlayerRankingStatLine = Pick<
  PlayerRanking,
  | "points"
  | "assists"
  | "rebounds"
  | "fieldGoalPercentage"
  | "threePointPercentage"
  | "rating"
>;

export type PlayerRankingSortField = keyof PlayerRankingStatLine;

export type PlayerRankingSortDirection = "asc" | "desc";

export type StatisticLeaderAccent = "points" | "assists" | "rebounds" | "rating";

export type StatisticLeader = {
  id: string;
  accent: StatisticLeaderAccent;
  label: string;
  value: string;
  playerName: string;
  teamName: string;
};
