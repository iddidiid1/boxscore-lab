export type EventStatus = "PREPARING" | "ONGOING" | "COMPLETED";
export type EventTier = "S" | "A" | "B" | "C";
export type PlayerAwardType = "EVENT_MVP" | "ALL_EVENT_FIRST_TEAM" | "ALL_EVENT_SECOND_TEAM";

export type EventChampion = { teamId: number; teamSlug: string; teamName: string; resultTagId: number; resultTagLabel: string };
export type EventListItem = {
  id: number; slug: string; name: string; tier: EventTier; status: EventStatus;
  description: string | null; countsForRanking: boolean; rankingOrder: number;
  participatingTeamCount: number; champion: EventChampion | null; createdAt: string; updatedAt: string;
};
export type EventStageTag = { id?: number; slug?: string; label: string; description?: string | null; sortOrder: number };
export type EventResultTag = { id?: number; slug?: string; label: string; isWinnerTag: boolean; rankingPoints: number; sortOrder: number };
export type EventParticipant = {
  teamId: number; teamSlug: string; teamName: string; teamArchivedAt: string | null;
  divisionId: number | null; divisionName: string | null; isEligible: boolean;
};
export type AwardCandidatePlayer = {
  playerId: number; playerSlug: string; playerName: string; number: number; position: string;
  teamId: number; teamSlug: string; teamName: string;
};
export type EventTeamResult = { id: number; teamId: number; teamSlug: string; teamName: string; resultTagId: number; resultTagLabel: string; notes: string | null };
export type EventPlayerAward = {
  id: number; awardType: PlayerAwardType; playerId: number; playerSlug: string; playerName: string;
  playerIsActive: boolean; teamId: number; teamSlug: string; teamName: string; notes: string | null;
};
export type EventDetail = {
  id: number; slug: string; name: string; tier: EventTier; status: EventStatus; description: string | null;
  countsForRanking: boolean; rankingOrder: number; archivedAt: string | null; deletedAt: string | null;
  participants: EventParticipant[]; awardCandidatePlayers: AwardCandidatePlayer[];
  stageTags: EventStageTag[]; resultTags: EventResultTag[]; teamResults: EventTeamResult[];
  playerAwards: EventPlayerAward[]; createdAt: string; updatedAt: string;
};
export type EventConfigurationPayload = {
  name?: string; tier?: EventTier; status?: EventStatus; description?: string | null; countsForRanking?: boolean;
  participantTeamIds?: number[]; stageTags?: Array<Omit<EventStageTag, "slug">>; resultTags?: Array<Omit<EventResultTag, "slug">>;
};
export type EventOutcomesPayload = {
  teamResults?: Array<{ teamId: number; resultTagId: number; notes?: string | null }>;
  playerAwards?: Array<{ awardType: PlayerAwardType; playerId: number; teamId: number; notes?: string | null }>;
};
export type TeamOption = {
  teamId: number; teamSlug: string; teamName: string; divisionId: number | null; divisionName: string | null;
  isEligible: boolean; unavailableReason?: string;
};
