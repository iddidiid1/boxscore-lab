import { Badge, Box, Group, Text } from "@mantine/core";
import type { MatchDetail } from "../../../features/matches";
import { MatchTeamSummary } from "./MatchTeamSummary";

export function MatchScoreHeader({ match }: { match: MatchDetail }) {
  const home = match.teams.find((team) => team.role === "HOME")!;
  const away = match.teams.find((team) => team.role === "AWAY")!;
  const format = new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(match.playedAt));
  return (
    <Box className="match-detail-score-card">
      <Group className="match-detail-meta" gap="xs">
        <Text className="match-detail-event">{match.event.name}</Text>
        {match.stageTag ? <Badge className="match-detail-tag" variant="light">{match.stageTag.label}</Badge> : null}
        <Text className="match-detail-date">{format}</Text>
      </Group>
      <Box className="match-detail-scoreline">
        <MatchTeamSummary isWinner={home.score > away.score} side="home" team={home} />
        <Group className="match-detail-final-score" gap="sm" justify="center" wrap="nowrap">
          <Text className="match-detail-score-number" data-winner={home.score > away.score || undefined}>{home.score}</Text>
          <Text className="match-detail-score-divider">-</Text>
          <Text className="match-detail-score-number" data-winner={away.score > home.score || undefined}>{away.score}</Text>
        </Group>
        <MatchTeamSummary isWinner={away.score > home.score} side="away" team={away} />
      </Box>
    </Box>
  );
}
