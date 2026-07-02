import { Box, Group, Stack, Text, Title } from "@mantine/core";

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
    <Stack className="player-profile-header" gap="md">
      <Group align="center" gap="lg" wrap="nowrap">
        <Box
          aria-hidden="true"
          className="player-profile-team-accent"
          style={{ backgroundColor: teamColor }}
        />

        <Stack className="player-profile-content" gap={6}>
          <Title order={1}>{name}</Title>
          <Text className="player-profile-secondary">
            #{number} {"\u00b7"} {team} {"\u00b7"} {position}
          </Text>
          {!isActive && <Text className="player-profile-secondary">Inactive player</Text>}
          {teamArchived && <Text className="player-profile-secondary">Archived team</Text>}
        </Stack>
      </Group>
    </Stack>
  );
}
