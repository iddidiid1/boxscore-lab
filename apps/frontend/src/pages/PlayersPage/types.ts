import type { PlayerListItem, PlayerSortField } from "../../features/players";
export type PlayerRanking = PlayerListItem;
export type PlayerRankingSortField = PlayerSortField;
export type PlayerRankingSortDirection = "asc" | "desc";
export type StatisticLeaderAccent = "points" | "assists" | "rebounds" | "rating";
export type StatisticLeader = { id: string; accent: StatisticLeaderAccent; label: string; value: string; playerName: string; teamName: string };
