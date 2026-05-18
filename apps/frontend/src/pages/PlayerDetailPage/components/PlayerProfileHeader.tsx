import { Box, Group, Stack, Text, Title } from "@mantine/core";

type PlayerProfileHeaderProps = {
  name: string;
  position: string;
  team: string;
  teamColor: string;
};

export function PlayerProfileHeader({
  name,
  position,
  team,
  teamColor
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
            {team} {"\u00b7"} {position}
          </Text>
        </Stack>
      </Group>
    </Stack>
  );
}
