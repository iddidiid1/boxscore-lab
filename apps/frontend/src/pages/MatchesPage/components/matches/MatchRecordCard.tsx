import { Badge, Box, Group, Text } from "@mantine/core";
import type { MatchRecord } from "../../types";

type MatchRecordCardProps = {
  match: MatchRecord;
};

function formatMatchDateTime(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium"
  }).format(new Date(startsAt));
}

function getWinner(match: MatchRecord) {
  if (match.teamAScore === match.teamBScore) {
    return null;
  }

  return match.teamAScore > match.teamBScore ? match.teamA.id : match.teamB.id;
}

export function MatchRecordCard({ match }: MatchRecordCardProps) {
  const winnerId = getWinner(match);
  const isTeamAWinner = winnerId === match.teamA.id;
  const isTeamBWinner = winnerId === match.teamB.id;

  function handleMatchSelect() {
    const nextPath = `/matches/${match.id}`;

    window.history.pushState({}, "", nextPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <Box className="match-card" component="button" onClick={handleMatchSelect} type="button">
      <Box className="match-main">
        <Box className="match-scoreline">
          <Box className="match-team match-team-home">
            <Box
              aria-hidden="true"
              className="match-team-bar"
              style={{ backgroundColor: match.teamA.color }}
            />
            <Text className="match-team-name" data-winner={isTeamAWinner || undefined}>
              {match.teamA.name}
            </Text>
          </Box>

          <Group className="match-score" gap="xs" justify="center" wrap="nowrap">
            <Text className="match-score-number" data-winner={isTeamAWinner || undefined}>
              {match.teamAScore}
            </Text>
            <Text className="match-score-separator">-</Text>
            <Text className="match-score-number" data-winner={isTeamBWinner || undefined}>
              {match.teamBScore}
            </Text>
          </Group>

          <Box className="match-team match-team-away">
            <Text className="match-team-name" data-winner={isTeamBWinner || undefined}>
              {match.teamB.name}
            </Text>
            <Box
              aria-hidden="true"
              className="match-team-bar"
              style={{ backgroundColor: match.teamB.color }}
            />
          </Box>
        </Box>

        <Group className="match-meta" gap="xs">
          <Text className="match-event-label">
            {match.eventName}
          </Text>
          <Group className="match-meta-secondary" gap="xs" wrap="wrap">
            {match.tags.map((tag) => (
              <Badge className="match-tag-badge" key={tag} variant="light">
                {tag}
              </Badge>
            ))}
            <Text className="match-date">{formatMatchDateTime(match.startsAt)}</Text>
          </Group>
        </Group>
      </Box>
    </Box>
  );
}
