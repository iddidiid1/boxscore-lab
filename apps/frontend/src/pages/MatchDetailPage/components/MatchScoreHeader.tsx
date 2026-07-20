import { Badge, Box, Group, Text } from "@mantine/core";
import type { MatchDetail } from "../../../features/matches";
import { MatchTeamSummary } from "./MatchTeamSummary";

export function MatchScoreHeader({ match }: { match: MatchDetail }) {
  const home = match.teams.find((team) => team.role === "HOME")!;
  const away = match.teams.find((team) => team.role === "AWAY")!;
  const homeOutcome = home.score > away.score ? "winner" : home.score < away.score ? "loser" : "level";
  const awayOutcome = away.score > home.score ? "winner" : away.score < home.score ? "loser" : "level";
  const format = new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(match.playedAt));
  return (
    <Box className="match-detail-score-card app-surface app-surface--data">
      <Group className="match-detail-meta" gap="xs">
        <Text className="match-detail-event">{match.event.name}</Text>
        {match.stageTag ? (
          <Badge className="match-detail-tag" variant="light">
            {match.stageTag.label}
          </Badge>
        ) : (
          <Text aria-label="No stage" className="match-detail-stage-missing">—</Text>
        )}
        <Text className="match-detail-date">{format}</Text>
      </Group>
      <Box className="match-detail-scoreline">
        <MatchTeamSummary outcome={homeOutcome} side="home" team={home} />
        <Group className="match-detail-final-score" gap="sm" justify="center" wrap="nowrap">
          <Text className="match-detail-score-number" data-outcome={homeOutcome}>{home.score}</Text>
          <Text className="match-detail-score-divider">-</Text>
          <Text className="match-detail-score-number" data-outcome={awayOutcome}>{away.score}</Text>
        </Group>
        <MatchTeamSummary outcome={awayOutcome} side="away" team={away} />
      </Box>
    </Box>
  );
}
