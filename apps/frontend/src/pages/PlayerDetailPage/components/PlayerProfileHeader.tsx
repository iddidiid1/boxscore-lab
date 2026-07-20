import { Box, Stack, Text, Title } from "@mantine/core";
import { Archive, CircleOff } from "lucide-react";
import type { CSSProperties } from "react";

type PlayerProfileHeaderProps = {
  name: string;
  position: string;
  team: string;
  teamColor: string;
  number: number;
  isActive: boolean;
  teamArchived: boolean;
};

export function PlayerProfileHeader({
  name,
  position,
  team,
  teamColor,
  number,
  isActive,
  teamArchived
}: PlayerProfileHeaderProps) {
  return (
    <Stack
      className="player-profile-header"
      gap="md"
      style={{ "--player-team-color": teamColor } as CSSProperties}
    >
      <Box className="player-number-masthead">
        <Text aria-hidden="true" className="player-number-echo">
          #{number}
        </Text>
        <Text className="player-number">#{number}</Text>
        <Stack className="player-profile-content" gap={8}>
          <Title order={1}>{name}</Title>
          <Box className="player-profile-facts">
            <Box>
              <Text className="data-label">Team</Text>
              <Text className="player-profile-fact-value">{team}</Text>
            </Box>
            <Box>
              <Text className="data-label">Position</Text>
              <Text className="player-profile-fact-value">{position}</Text>
            </Box>
          </Box>
          {(!isActive || teamArchived) && (
            <Box className="player-profile-statuses">
              {!isActive && (
                <Text className="player-profile-status">
                  <CircleOff aria-hidden="true" />
                  Inactive player
                </Text>
              )}
              {teamArchived && (
                <Text className="player-profile-status">
                  <Archive aria-hidden="true" />
                  Archived team
                </Text>
              )}
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
