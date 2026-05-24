import { Box, Text } from "@mantine/core";
import type { MatchDetailTeam } from "../types";

type MatchTeamSummaryProps = {
  isWinner: boolean;
  side: "home" | "away";
  team: MatchDetailTeam;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MatchTeamSummary({ isWinner, side, team }: MatchTeamSummaryProps) {
  return (
    <Box className={`match-detail-team match-detail-team-${side}`}>
      <Box
        className="match-detail-team-logo"
        style={{ borderColor: team.color }}
      >
        {getInitials(team.name)}
      </Box>
      <Box className="match-detail-team-copy">
        <Text className="match-detail-team-side">{side === "home" ? "Home" : "Away"}</Text>
        <Text className="match-detail-team-name" data-winner={isWinner || undefined}>
          {team.name}
        </Text>
      </Box>
    </Box>
  );
}
