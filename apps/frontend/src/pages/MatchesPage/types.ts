export type MatchTeam = {
  id: string;
  name: string;
  color: string;
};

export type MatchRecord = {
  id: string;
  eventName: string;
  startsAt: string;
  tags: string[];
  teamA: MatchTeam;
  teamAScore: number;
  teamB: MatchTeam;
  teamBScore: number;
};
