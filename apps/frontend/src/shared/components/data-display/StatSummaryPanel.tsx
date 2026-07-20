import { Box, Text, Title } from "@mantine/core";

export type StatSummaryItem = {
  label: string;
  value: string;
};

type StatSummaryPanelProps = {
  className?: string;
  stats: StatSummaryItem[];
  title: string;
};

export function StatSummaryPanel({
  className,
  stats,
  title
}: StatSummaryPanelProps) {
  const classes = [
    "app-stat-summary app-surface app-surface--summary",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Box className={classes}>
      <Title order={2}>{title}</Title>
      <Box className="app-stat-summary__grid" data-count={stats.length}>
        {stats.map((stat) => (
          <Box className="app-stat-summary__item" key={stat.label}>
            <Text className="app-stat-summary__label">{stat.label}</Text>
            <Text className="app-stat-summary__value">{stat.value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
