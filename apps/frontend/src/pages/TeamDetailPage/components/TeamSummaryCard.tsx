import { Box, Text, Title } from "@mantine/core";

export type TeamSummaryStat = {
  label: string;
  value: string;
};

type TeamSummaryCardProps = {
  stats: TeamSummaryStat[];
};

export function TeamSummaryCard({ stats }: TeamSummaryCardProps) {
  return (
    <Box className="team-summary-card">
      <Title order={2}>Team Summary</Title>
      <Box className="team-summary-stats">
        {stats.map((stat) => (
          <Box className="team-summary-stat" key={stat.label}>
            <Text className="data-label">{stat.label}</Text>
            <Text className="team-summary-value">{stat.value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
