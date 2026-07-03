import { Box, Text, Title } from "@mantine/core";

export type PlayerSummaryStat = {
  label: string;
  value: string;
};

type PlayerStatSummaryProps = {
  stats: PlayerSummaryStat[];
};

export function PlayerStatSummary({ stats }: PlayerStatSummaryProps) {
  return (
    <Box className="player-summary-card app-panel">
      <Title order={2}>Stat Summary</Title>
      <Box className="player-summary-stats">
        {stats.map((stat) => (
          <Box className="player-summary-stat" key={stat.label}>
            <Text className="data-label">{stat.label}</Text>
            <Text className="player-summary-value">{stat.value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
