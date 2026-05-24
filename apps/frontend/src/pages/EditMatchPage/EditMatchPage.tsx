import { MatchFormPage, type MatchFormInitialValues } from "../CreateMatchPage";
import { MATCH_OTHER_PLAYER_ID, type PlayerStatInput, type PlayerStatsById } from "../CreateMatchPage/types";
import { mockMatchFormEvents } from "../CreateMatchPage/mockMatchForm";
import { mockMatchDetails } from "../MatchDetailPage/mockMatchDetail";
import type { BoxScoreOtherStats, BoxScorePlayer, MatchDetailRecord } from "../MatchDetailPage/types";

type EditMatchPageProps = {
  matchId: string;
};

function toPlayerStatInput(player: BoxScorePlayer): PlayerStatInput {
  return {
    points: player.points,
    rebounds: player.rebounds,
    assists: player.assists,
    fieldGoalsMade: player.fieldGoalsMade,
    fieldGoalsAttempted: player.fieldGoalsAttempted,
    threePointersMade: player.threePointersMade,
    threePointersAttempted: player.threePointersAttempted,
    minutes: player.minutes,
    rating: player.rating
  };
}

function toOtherStatInput(otherStats: BoxScoreOtherStats | undefined): PlayerStatInput {
  return {
    points: otherStats?.points ?? 0,
    rebounds: otherStats?.rebounds ?? 0,
    assists: otherStats?.assists ?? 0,
    fieldGoalsMade: otherStats?.fieldGoalsMade ?? 0,
    fieldGoalsAttempted: otherStats?.fieldGoalsAttempted ?? 0,
    threePointersMade: otherStats?.threePointersMade ?? 0,
    threePointersAttempted: otherStats?.threePointersAttempted ?? 0,
    minutes: 0,
    rating: 0
  };
}

function toTeamStats(match: MatchDetailRecord, teamId: string): PlayerStatsById {
  const rosterStats = Object.fromEntries(
    match.players
      .filter((player) => player.teamId === teamId)
      .map((player) => [player.id, toPlayerStatInput(player)])
  );

  return {
    ...rosterStats,
    [MATCH_OTHER_PLAYER_ID]: toOtherStatInput(match.otherStats[teamId])
  };
}

function toInitialValues(match: MatchDetailRecord): MatchFormInitialValues {
  const eventId =
    mockMatchFormEvents.find((event) => event.name === match.eventName)?.id ?? null;

  return {
    eventId,
    selectedTags: match.tags,
    matchDate: match.date,
    homeTeamId: match.homeTeam.id,
    awayTeamId: match.awayTeam.id,
    homeStats: toTeamStats(match, match.homeTeam.id),
    awayStats: toTeamStats(match, match.awayTeam.id)
  };
}

export function EditMatchPage({ matchId }: EditMatchPageProps) {
  const match = mockMatchDetails.find((matchDetail) => matchDetail.id === matchId) ?? mockMatchDetails[0];

  return (
    <MatchFormPage
      cancelHref={`/matches/${match.id}`}
      description="Update match information and box score stats."
      initialValues={toInitialValues(match)}
      title="Edit Match"
    />
  );
}
