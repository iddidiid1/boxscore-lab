import { Alert, Anchor, Box, Button, Group, Skeleton, Stack, Text } from "@mantine/core";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTeam, type TeamDetail } from "../../features/teams";
import { RosterTable, type Player } from "./components/RosterTable";
import { TeamRadarCard, type TeamRadarAttribute } from "./components/TeamRadarCard";
import { TeamProfileSummary } from "./components/TeamProfileSummary";
import { TeamSummaryCard, type TeamSummaryStat } from "./components/TeamSummaryCard";
import "./TeamDetailPage.css";

function getSlugFromPath() {
  const match = window.location.pathname.match(/^\/teams\/([^/]+)\/?$/);
  return match?.[1] ?? "";
}

function percentage(made: number, attempted: number) {
  if (attempted === 0) {
    return "0.0%";
  }
  return `${((made / attempted) * 100).toFixed(1)}%`;
}

function mapRadar(team: TeamDetail): TeamRadarAttribute[] | null {
  if (team.profileRating === null) {
    return null;
  }
  return [
    { label: "DEF", value: team.profileRating.defense },
    { label: "OFF", value: team.profileRating.offense },
    { label: "CON", value: team.profileRating.consistency },
    { label: "COH", value: team.profileRating.cohesion },
    { label: "DEP", value: team.profileRating.depth }
  ];
}

function mapSummary(team: TeamDetail): TeamSummaryStat[] {
  return [
    { label: "PTS", value: team.teamStats.avgPoints.toFixed(1) },
    { label: "REB", value: team.teamStats.avgRebounds.toFixed(1) },
    { label: "AST", value: team.teamStats.avgAssists.toFixed(1) },
    {
      label: "FG%",
      value: percentage(team.teamStats.avgFieldGoalsMade, team.teamStats.avgFieldGoalsAttempted)
    },
    {
      label: "3P%",
      value: percentage(team.teamStats.avgThreePointersMade, team.teamStats.avgThreePointersAttempted)
    }
  ];
}

function mapPlayers(team: TeamDetail): Player[] {
  return team.players.map((player) => ({
    id: String(player.id),
    slug: player.slug,
    number: player.number,
    position: player.position,
    name: player.name,
    points: player.stats.avgPoints,
    rebounds: player.stats.avgRebounds,
    assists: player.stats.avgAssists,
    fieldGoalPercentage:
      player.stats.avgFieldGoalsAttempted === 0
        ? 0
        : (player.stats.avgFieldGoalsMade / player.stats.avgFieldGoalsAttempted) * 100,
    threePointPercentage:
      player.stats.avgThreePointersAttempted === 0
        ? 0
        : (player.stats.avgThreePointersMade / player.stats.avgThreePointersAttempted) * 100,
    averageMinutes: player.stats.avgMinutes,
    starRating: player.stats.avgRating
  }));
}

export function TeamDetailPage() {
  const slug = getSlugFromPath();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    fetchTeam(slug, controller.signal)
      .then(setTeam)
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load team.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [slug]);

  if (isLoading) {
    return (
      <Stack className="team-detail-page" gap="md">
        <Skeleton height={40} radius={4} />
        <Skeleton height={280} radius={6} />
        <Skeleton height={160} radius={6} />
      </Stack>
    );
  }

  if (error || team === null) {
    return (
      <Stack className="team-detail-page" gap="md">
        <Anchor className="team-detail-back-link" href="/teams">
          {"\u2190 Back to Teams"}
        </Anchor>
        <Alert color="red" title="Team not found">
          {error ?? "Team not found."}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack className="team-detail-page" gap="md">
      <Group className="team-detail-actions" justify="space-between">
        <Anchor className="team-detail-back-link" href="/teams">
          {"\u2190 Back to Teams"}
        </Anchor>
        {team.archivedAt === null ? (
          <Button
            className="manage-team-button app-action-button app-action-button--primary"
            component="a"
            href={`/teams/${team.slug}/manage`}
            leftSection={<Pencil size={16} />}
          >
            Manage Team
          </Button>
        ) : null}
      </Group>

      {team.archivedAt !== null ? (
        <Alert color="yellow" title="Archived team">
          <Text>This team is archived. Historical stats remain available.</Text>
        </Alert>
      ) : null}

      <Box className="team-detail-hero">
        <TeamProfileSummary
          description={team.description ?? ""}
          division={team.divisionName ?? "No Division"}
          logoUrl={team.logoUrl ?? undefined}
          name={team.name}
          overallRating={team.overallRating ?? 0}
          points={team.totalPoints}
        />
        <TeamRadarCard attributes={mapRadar(team)} />
      </Box>

      <TeamSummaryCard stats={mapSummary(team)} />

      <RosterTable players={mapPlayers(team)} />
    </Stack>
  );
}
