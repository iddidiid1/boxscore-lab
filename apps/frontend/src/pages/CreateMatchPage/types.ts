import type { MatchRole, OtherStatPayload, PlayerStatPayload } from "../../features/matches";
import type { PlayerPosition } from "../../features/teams/types";

export type PlayerStatInput = Omit<PlayerStatPayload, "playerId">;
export type MatchFormPlayer = { id: number; name: string; number: number; position: PlayerPosition; isActive: boolean };
export type MatchFormTeam = { id: number; name: string; color: string | null; archivedAt: string | null; players: MatchFormPlayer[] };

// Editable stat drafts: a cell may be empty (`null`) while the user is filling
// the form, so blank stays blank instead of snapping back to `0`. Empty cells
// are coerced to `0` only when building the submit payload (see toStatNumbers),
// so the backend still receives complete integer stats.
export type PlayerStatDraft = { [K in keyof PlayerStatInput]: number | null };
export type OtherStatDraft = { [K in keyof OtherStatPayload]: number | null };
export type PlayerEntry = { appeared: boolean; stats: PlayerStatDraft };
export type TeamFormState = { role: MatchRole; team?: MatchFormTeam; entries: Record<number, PlayerEntry>; otherStats: OtherStatDraft };

export const emptyPlayerStats = (): PlayerStatDraft => ({ points: null, rebounds: null, assists: null, fieldGoalsMade: null, fieldGoalsAttempted: null, threePointersMade: null, threePointersAttempted: null, minutes: null, rating: null });
export const emptyOtherStats = (): OtherStatDraft => ({ points: null, rebounds: null, assists: null, fieldGoalsMade: null, fieldGoalsAttempted: null, threePointersMade: null, threePointersAttempted: null });

// Coerce an editable draft into a complete numeric stat object (empty -> 0).
export const toStatNumbers = <T extends Record<string, number | null>>(draft: T): { [K in keyof T]: number } =>
  Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value ?? 0])) as { [K in keyof T]: number };
