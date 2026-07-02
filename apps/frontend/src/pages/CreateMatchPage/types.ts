import type { MatchRole, OtherStatPayload, PlayerStatPayload } from "../../features/matches";
import type { PlayerPosition } from "../../features/teams/types";

export type PlayerStatInput = Omit<PlayerStatPayload, "playerId">;
export type MatchFormPlayer = { id: number; name: string; number: number; position: PlayerPosition; isActive: boolean };
export type MatchFormTeam = { id: number; name: string; color: string | null; archivedAt: string | null; players: MatchFormPlayer[] };
export type PlayerEntry = { appeared: boolean; stats: PlayerStatInput };
export type TeamFormState = { role: MatchRole; team?: MatchFormTeam; entries: Record<number, PlayerEntry>; otherStats: OtherStatPayload };

export const emptyPlayerStats = (): PlayerStatInput => ({ points: 0, rebounds: 0, assists: 0, fieldGoalsMade: 0, fieldGoalsAttempted: 0, threePointersMade: 0, threePointersAttempted: 0, minutes: 0, rating: 0 });
export const emptyOtherStats = (): OtherStatPayload => ({ points: 0, rebounds: 0, assists: 0, fieldGoalsMade: 0, fieldGoalsAttempted: 0, threePointersMade: 0, threePointersAttempted: 0 });
