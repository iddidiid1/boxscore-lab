export type EventStatus = "preparing" | "ongoing" | "completed";
export type EventTier = "S" | "A" | "B" | "C";

export type EventSummary = {
  id: string;
  name: string;
  tier: EventTier;
  status: EventStatus;
  description: string;
  participatingTeamCount: number;
  winnerName?: string;
  stageTags: EventStageTag[];
  resultTags: EventResultTag[];
  results: EventResult[];
};

export type EventStageTag = {
  id: string;
  label: string;
  description?: string;
};

export type EventResultTag = {
  id: string;
  label: string;
  isWinnerTag: boolean;
  rankingPoints: number;
};

export type EventResult = {
  teamId: string;
  teamName: string;
  resultTagId: string;
  notes?: string;
};
