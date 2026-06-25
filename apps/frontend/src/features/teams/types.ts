
export type ApiErrorDetail = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  statusCode: number;
  error: string;
  message: string;
  details: ApiErrorDetail[];
};

export type Division = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
};

export type TeamListItem = {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  overallRating: number | null;
  totalPoints: number;
  archivedAt: string | null;
};

export type TeamDivisionGroup = {
  divisionId: number;
  divisionName: string;
  divisionSlug: string;
  divisionSortOrder: number;
  teams: TeamListItem[];
};

export type ProfileRating = {
  defense: number;
  offense: number;
  consistency: number;
  cohesion: number;
  depth: number;
};

export type TeamStats = {
  gamesPlayed: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgFieldGoalsMade: number;
  avgFieldGoalsAttempted: number;
  avgThreePointersMade: number;
  avgThreePointersAttempted: number;
};

export type PlayerPosition = "PG" | "SG" | "G" | "F" | "SF" | "PF" | "C";

export type PlayerStats = {
  gamesPlayed: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgFieldGoalsMade: number;
  avgFieldGoalsAttempted: number;
  avgThreePointersMade: number;
  avgThreePointersAttempted: number;
  avgMinutes: number;
  avgRating: number;
};

export type TeamPlayer = {
  id: number;
  slug: string;
  name: string;
  number: number;
  position: PlayerPosition;
  isActive: boolean;
  stats: PlayerStats;
};

export type TeamDetail = {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  divisionId: number | null;
  divisionName: string | null;
  divisionSlug: string | null;
  overallRating: number | null;
  totalPoints: number;
  description: string | null;
  archivedAt: string | null;
  profileRating: ProfileRating | null;
  teamStats: TeamStats;
  players: TeamPlayer[];
};

export type TeamPlayerPayload = {
  id?: number;
  name?: string;
  number?: number;
  position?: PlayerPosition;
  isActive?: boolean;
};

export type TeamMutationPayload = {
  name?: string;
  divisionId?: number | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  overallRating?: number | null;
  description?: string | null;
  profileRating?: ProfileRating;
  players?: TeamPlayerPayload[];
};
