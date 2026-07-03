import { Badge, Box, Group, Text } from "@mantine/core";
import type { MatchListItem } from "../../../../features/matches";

type MatchRecordCardProps = {
  match: MatchListItem;
};

function formatMatchDateTime(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium", timeStyle: "short"
  }).format(new Date(startsAt));
}

export function MatchRecordCard({ match }: MatchRecordCardProps) {
  const isTeamAWinner = match.homeTeam.score > match.awayTeam.score;
  const isTeamBWinner = match.awayTeam.score > match.homeTeam.score;

  function handleMatchSelect() {
    const nextPath = `/matches/${match.id}`;

    window.history.pushState({}, "", nextPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <Box className="match-card app-panel" component="button" onClick={handleMatchSelect} type="button">
      <Box className="match-main">
        <Box className="match-scoreline">
          <Box className="match-team match-team-home">
            <Box
              aria-hidden="true"
              className="match-team-bar"
              style={{ backgroundColor: match.homeTeam.primaryColor ?? "var(--color-border)" }}
            />
            <Text className="match-team-name" data-winner={isTeamAWinner || undefined}>
              {match.homeTeam.name}
            </Text>
          </Box>

          <Group className="match-score" gap="xs" justify="center" wrap="nowrap">
            <Text className="match-score-number" data-winner={isTeamAWinner || undefined}>
              {match.homeTeam.score}
            </Text>
            <Text className="match-score-separator">-</Text>
            <Text className="match-score-number" data-winner={isTeamBWinner || undefined}>
              {match.awayTeam.score}
            </Text>
          </Group>

          <Box className="match-team match-team-away">
            <Text className="match-team-name" data-winner={isTeamBWinner || undefined}>
              {match.awayTeam.name}
            </Text>
            <Box
              aria-hidden="true"
              className="match-team-bar"
              style={{ backgroundColor: match.awayTeam.primaryColor ?? "var(--color-border)" }}
            />
          </Box>
        </Box>

        <Group className="match-meta" gap="xs">
          <Text className="match-event-label">
            {match.event.name}
          </Text>
          <Group className="match-meta-secondary" gap="xs" wrap="wrap">
            {match.stageTag ? <Badge className="match-tag-badge" variant="light">{match.stageTag.label}</Badge> : null}
            <Text className="match-date">{formatMatchDateTime(match.playedAt)}</Text>
          </Group>
        </Group>
      </Box>
    </Box>
  );
}
