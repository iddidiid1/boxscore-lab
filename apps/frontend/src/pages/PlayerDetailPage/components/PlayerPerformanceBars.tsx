import { Box, Text, Title } from "@mantine/core";

export type PlayerPerformanceDimension = {
  label: string;
  value: number;
};

type PlayerPerformanceBarsProps = {
  dimensions: PlayerPerformanceDimension[];
};

function clampValue(value: number) {
  return Math.round(Math.max(0, Math.min(100, value)));
}

export function PlayerPerformanceBars({ dimensions }: PlayerPerformanceBarsProps) {
  return (
    <Box className="player-performance-card app-surface app-surface--data">
      <Title order={2}>Performance Profile</Title>
      <Text className="player-performance-helper">
        Relative to the leader in the current statistics scope.
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
              <Box
                aria-label={`${dimension.label}: ${value} out of 100 relative to the current scope leader`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={value}
                className="player-performance-segments"
                role="meter"
              >
                {Array.from({ length: 10 }, (_, index) => {
                  const fill = Math.max(0, Math.min(1, (value - index * 10) / 10));

                  return (
                    <Box aria-hidden="true" className="player-performance-segment" key={index}>
                      <Box
                        className="player-performance-segment-fill"
                        style={{ width: `${fill * 100}%` }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
