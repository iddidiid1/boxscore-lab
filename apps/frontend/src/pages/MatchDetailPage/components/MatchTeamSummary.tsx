import { Box, Text } from "@mantine/core";
import type { CSSProperties } from "react";
import type { MatchDetailTeam } from "../../../features/matches";
import { TeamArtwork } from "../../../shared/components/team-identity";

type MatchTeamSummaryProps = {
  outcome: "winner" | "loser" | "level";
  side: "home" | "away";
  team: MatchDetailTeam;
};

export function MatchTeamSummary({ outcome, side, team }: MatchTeamSummaryProps) {
  const style = {
    "--match-team-color": team.team.primaryColor ?? "var(--color-team-trace-neutral)"
  } as CSSProperties;

  return (
    <Box
      className={`match-detail-team match-detail-team-${side}`}
      data-outcome={outcome}
      style={style}
    >
      <TeamArtwork
        logoUrl={team.team.logoUrl}
        name={team.team.name}
        size="detail"
      />
      <Box className="match-detail-team-copy">
        <Text className="match-detail-team-side">{side === "home" ? "Home" : "Away"}</Text>
        <Text className="match-detail-team-name">{team.team.name}</Text>
      </Box>
    </Box>
  );
}
