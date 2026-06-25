import { Badge, Box, Group, Stack, Title } from "@mantine/core";
import { TeamCard } from "./TeamCard";
import type { Division, Team } from "../types";

type DivisionCardProps = {
  division: Division;
  teams: Team[];
};

export function DivisionCard({ division, teams }: DivisionCardProps) {
  return (
    <Box className="division-section">
      <Group className="division-heading" justify="space-between">
        <Box>
          <Title order={3}>{division.divisionName}</Title>
        </Box>
        <Badge className="status-chip" color="green" variant="light">
          {teams.length} teams
        </Badge>
      </Group>

      <Stack gap="sm">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </Stack>
    </Box>
  );
}
