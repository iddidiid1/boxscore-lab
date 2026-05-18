import { Box, Text, Title } from "@mantine/core";

export type PlayerPerformanceDimension = {
  label: string;
  value: number;
};

type PlayerPerformanceBarsProps = {
  dimensions: PlayerPerformanceDimension[];
};

function clampValue(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function PlayerPerformanceBars({ dimensions }: PlayerPerformanceBarsProps) {
  return (
    <Box className="player-performance-card">
      <Title order={2}>Performance Profile</Title>
      <Text className="player-performance-helper">
        Placeholder performance profile using fixed mock values.
      </Text>

      <Box className="player-performance-bars">
        {dimensions.map((dimension) => {
          const value = clampValue(dimension.value);

          return (
            <Box className="player-performance-row" key={dimension.label}>
              <Box className="player-performance-row-header">
                <Text className="data-label">{dimension.label}</Text>
                <Text className="player-performance-score">{value}</Text>
              </Box>
              <Box className="player-performance-track">
                <Box className="player-performance-fill" style={{ width: `${value}%` }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
