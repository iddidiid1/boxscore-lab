import { Badge, Box, Group, Text } from "@mantine/core";
import type { MatchDetailRecord } from "../types";
import { MatchTeamSummary } from "./MatchTeamSummary";

type MatchScoreHeaderProps = {
  match: MatchDetailRecord;
};

function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium"
  }).format(new Date(date));
}

export function MatchScoreHeader({ match }: MatchScoreHeaderProps) {
  const isHomeWinner = match.homeTeam.score > match.awayTeam.score;
  const isAwayWinner = match.awayTeam.score > match.homeTeam.score;

  return (
    <Box className="match-detail-score-card">
      <Group className="match-detail-meta" gap="xs">
        <Text className="match-detail-event">{match.eventName}</Text>
        {match.tags.map((tag) => (
          <Badge className="match-detail-tag" key={tag} variant="light">
            {tag}
          </Badge>
        ))}
        <Text className="match-detail-date">{formatMatchDate(match.date)}</Text>
      </Group>

      <Box className="match-detail-scoreline">
        <MatchTeamSummary isWinner={isHomeWinner} side="home" team={match.homeTeam} />

        <Group className="match-detail-final-score" gap="sm" justify="center" wrap="nowrap">
          <Text className="match-detail-score-number" data-winner={isHomeWinner || undefined}>
            {match.homeTeam.score}
          </Text>
          <Text className="match-detail-score-divider">-</Text>
          <Text className="match-detail-score-number" data-winner={isAwayWinner || undefined}>
            {match.awayTeam.score}
          </Text>
        </Group>

        <MatchTeamSummary isWinner={isAwayWinner} side="away" team={match.awayTeam} />
      </Box>
    </Box>
  );
}
