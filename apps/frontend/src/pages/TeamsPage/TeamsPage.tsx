import { Alert, Box, Button, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchTeams } from "../../features/teams";
import { CreateTeamButton } from "./components/CreateTeamButton";
import { DivisionCard } from "./components/DivisionCard";
import type { Division, Team } from "./types";
import { ListEmptyState } from "../../shared/components/ListEmptyState";
import "./TeamsPage.css";

export function TeamsPage() {
  const [divisions, setDivisions] = useState<Array<Division & { teams: Team[] }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTeams(signal?: AbortSignal) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTeams(signal);
      setDivisions(response.divisions);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }
      setError(loadError instanceof Error ? loadError.message : "Unable to load teams.");
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadTeams(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <Stack className="teams-page" gap="xl">
      <Group align="flex-start" className="teams-header" justify="space-between">
        <Box>
          <Text className="eyebrow">League overview</Text>
          <Title className="page-title" order={1}>
            Teams
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Manage all teams across divisions and compare current standing, points, and
            overall strength at a glance.
          </Text>
        </Box>

        <CreateTeamButton />
      </Group>

      {error ? (
        <Alert color="red" title="Unable to load teams">
          <Stack gap="sm">
            <Text>{error}</Text>
            <Button onClick={() => void loadTeams()} variant="light">Retry</Button>
          </Stack>
        </Alert>
      ) : null}

      {isLoading ? (
        <Box className="division-board">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton height={220} key={index} radius={6} />
          ))}
        </Box>
      ) : divisions.length === 0 && !error ? (
        <ListEmptyState
          description="Create the first team to start building the league board."
          title="No teams yet"
        />
      ) : (
        <Box className="division-board">
          {divisions.map((division) => (
            <DivisionCard division={division} key={division.divisionId} teams={division.teams} />
          ))}
        </Box>
      )}
    </Stack>
  );
}
