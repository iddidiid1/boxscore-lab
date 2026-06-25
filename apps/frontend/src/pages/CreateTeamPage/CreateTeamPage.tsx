import { Alert, Box, Button, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  ApiClientError,
  createTeam,
  fetchDivisions,
  type Division,
  type TeamMutationPayload,
  type TeamPlayerPayload
} from "../../features/teams";
import { PlayerManagementSection, type EditablePlayer } from "../ManageTeamPage/components/PlayerManagementSection";
import {
  TeamEditorForm,
  type TeamEditorValues
} from "../ManageTeamPage/components/TeamEditorForm";
import "../ManageTeamPage/ManageTeamPage.css";

const defaultTeam: TeamEditorValues = {
  name: "",
  divisionId: null,
  logoUrl: "",
  primaryColor: "#3B82F6",
  overallRating: 0,
  description: "",
  profileRating: {
    defense: 5,
    offense: 5,
    consistency: 5,
    cohesion: 5,
    depth: 5
  }
};

function mapErrors(error: ApiClientError) {
  return Object.fromEntries(error.response.details.map((detail) => [detail.field, detail.message]));
}

function buildPayload(team: TeamEditorValues, players: EditablePlayer[]): TeamMutationPayload {
  const playerPayload: TeamPlayerPayload[] = players.map((player) => ({
    name: player.name,
    number: player.number,
    position: player.position,
    isActive: true
  }));

  return {
    name: team.name,
    divisionId: team.divisionId,
    logoUrl: team.logoUrl.trim() || null,
    primaryColor: team.primaryColor.trim() || null,
    overallRating: team.overallRating,
    description: team.description.trim() || null,
    profileRating: team.profileRating,
    players: playerPayload
  };
}

export function CreateTeamPage() {
  const [team, setTeam] = useState<TeamEditorValues>(defaultTeam);
  const [players, setPlayers] = useState<EditablePlayer[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageError, setPageError] = useState<string | null>(null);
  const [rosterError, setRosterError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchDivisions(controller.signal)
      .then((response) => {
        setDivisions(response.divisions);
        setTeam((currentTeam) => ({
          ...currentTeam,
          divisionId: currentTeam.divisionId ?? response.divisions[0]?.id ?? null
        }));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setPageError(error instanceof Error ? error.message : "Unable to load divisions.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  async function handleSubmit() {
    setErrors({});
    setPageError(null);
    setRosterError(null);

    const duplicateNumbers = new Set<number>();
    const seenNumbers = new Set<number>();
    for (const player of players) {
      if (seenNumbers.has(player.number)) {
        duplicateNumbers.add(player.number);
      }
      seenNumbers.add(player.number);
    }
    if (duplicateNumbers.size > 0) {
      setRosterError("Active player numbers must be unique.");
      return;
    }

    setIsSubmitting(true);
    try {
      const createdTeam = await createTeam(buildPayload(team, players));
      window.location.href = `/teams/${createdTeam.slug}`;
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrors(mapErrors(error));
        if (error.response.error === "PLAYER_NUMBER_CONFLICT") {
          setRosterError(error.response.message);
        } else if (error.response.details.length === 0) {
          setPageError(error.response.message);
        }
      } else {
        setPageError(error instanceof Error ? error.message : "Unable to create team.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack className="manage-team-page" gap="lg">
      <Group align="flex-start" className="manage-team-header" justify="space-between">
        <Box>
          <Text className="eyebrow">TEAM WORKSPACE</Text>
          <Title className="page-title" order={1}>
            Create Team
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Create a new team profile, ratings, and roster setup.
          </Text>
        </Box>

        <Group gap="sm">
          <Button className="manage-team-save-button" loading={isSubmitting} onClick={() => void handleSubmit()}>
            Create Team
          </Button>
          <Button className="manage-team-cancel-button" component="a" href="/teams" variant="outline">
            Cancel
          </Button>
        </Group>
      </Group>

      {pageError ? <Alert color="red">{pageError}</Alert> : null}

      {isLoading ? (
        <Skeleton height={360} radius={6} />
      ) : (
        <>
          <TeamEditorForm
            disabled={isSubmitting}
            divisions={divisions}
            errors={errors}
            onChange={setTeam}
            value={team}
          />

          <PlayerManagementSection
            disabled={isSubmitting}
            errors={errors}
            onChange={setPlayers}
            rosterError={rosterError}
            value={players}
          />
        </>
      )}
    </Stack>
  );
}
