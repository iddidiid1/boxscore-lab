import { Badge, Box, Group, Text } from "@mantine/core";
import { Trophy } from "lucide-react";
import type { CSSProperties } from "react";
import type { MatchListItem } from "../../../../features/matches";
import { TeamArtwork } from "../../../../shared/components/team-identity";

type MatchRecordCardProps = {
  match: MatchListItem;
};

function formatMatchDateTime(startsAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium", timeStyle: "short"
  }).format(new Date(startsAt));
}

export function MatchRecordCard({ match }: MatchRecordCardProps) {
  const homeOutcome = match.homeTeam.score > match.awayTeam.score
    ? "winner"
    : match.homeTeam.score < match.awayTeam.score
      ? "loser"
      : "level";
  const awayOutcome = match.awayTeam.score > match.homeTeam.score
    ? "winner"
    : match.awayTeam.score < match.homeTeam.score
      ? "loser"
      : "level";
  const homeStyle = {
    "--match-team-color": match.homeTeam.primaryColor ?? "var(--color-team-trace-neutral)"
  } as CSSProperties;
  const awayStyle = {
    "--match-team-color": match.awayTeam.primaryColor ?? "var(--color-team-trace-neutral)"
  } as CSSProperties;

  return (
    <Box
      aria-label={`${match.homeTeam.name} ${match.homeTeam.score}, ${match.awayTeam.name} ${match.awayTeam.score}`}
      className="match-card"
      component="a"
      href={`/matches/${match.id}`}
    >
      <Box className="match-main">
        <Group className="match-meta" gap="xs">
          <Text className="match-event-label">
            {match.event.name}
          </Text>
          <Group className="match-meta-secondary" gap="xs" wrap="wrap">
            {match.stageTag ? (
              <Badge
                className="match-tag-badge app-edge-plate"
                title={match.stageTag.label}
                variant="light"
              >
                {match.stageTag.label}
              </Badge>
            ) : null}
            <Text className="match-date">{formatMatchDateTime(match.playedAt)}</Text>
          </Group>
        </Group>

        <Box className="match-scoreline">
          <Box
            className="match-team match-team-home"
            data-outcome={homeOutcome}
            style={homeStyle}
          >
            <TeamArtwork
              logoUrl={match.homeTeam.logoUrl}
              name={match.homeTeam.name}
              size="compact"
            />
            <Box className="match-team-copy">
              <Text className="match-team-role">Home</Text>
              <Text className="match-team-name">{match.homeTeam.name}</Text>
              {homeOutcome === "winner" ? (
                <Text className="match-winner-mark">
                  <Trophy aria-hidden="true" size={13} strokeWidth={1.8} />
                  Winner
                </Text>
              ) : null}
            </Box>
          </Box>

          <Group className="match-score" gap="xs" justify="center" wrap="nowrap">
            <Text className="match-score-number" data-outcome={homeOutcome}>
              {match.homeTeam.score}
            </Text>
            <Text className="match-score-separator">-</Text>
            <Text className="match-score-number" data-outcome={awayOutcome}>
              {match.awayTeam.score}
            </Text>
          </Group>

          <Box
            className="match-team match-team-away"
            data-outcome={awayOutcome}
            style={awayStyle}
          >
            <TeamArtwork
              logoUrl={match.awayTeam.logoUrl}
              name={match.awayTeam.name}
              size="compact"
            />
            <Box className="match-team-copy">
              <Text className="match-team-role">Away</Text>
              <Text className="match-team-name">{match.awayTeam.name}</Text>
              {awayOutcome === "winner" ? (
                <Text className="match-winner-mark">
                  <Trophy aria-hidden="true" size={13} strokeWidth={1.8} />
                  Winner
                </Text>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
