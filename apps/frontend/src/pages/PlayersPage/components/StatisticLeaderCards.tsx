import { Box, Text } from "@mantine/core";
import { Crown } from "lucide-react";
import type { StatisticLeader } from "../types";

type StatisticLeaderCardsProps = {
  leaders: StatisticLeader[];
};

export function StatisticLeaderCards({ leaders }: StatisticLeaderCardsProps) {
  return (
    <Box className="stat-leader-grid">
      {leaders.map((leader) => (
        <Box className={`stat-leader-card stat-leader-card-${leader.accent} app-panel`} key={leader.id}>
          <Box className="stat-leader-label-row">
            <Crown aria-hidden="true" className="stat-leader-crown" />
            <Text className="stat-leader-label">{leader.label}</Text>
          </Box>
          <Text className="stat-leader-value">{leader.value}</Text>
          <Box className="stat-leader-player">
            <Text className="stat-leader-name">{leader.playerName}</Text>
            <Text className="stat-leader-team">{leader.teamName}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
