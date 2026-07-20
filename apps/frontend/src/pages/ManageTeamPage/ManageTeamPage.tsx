import { Alert, Box, Button, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  ApiClientError,
  archiveTeam,
  fetchDivisions,
  fetchTeam,
  updateTeam,
  type Division,
  type TeamDetail,
  type TeamMutationPayload,
  type TeamPlayerPayload
} from "../../features/teams";
import { ConfirmModal } from "../../shared/components/ConfirmModal";
import { useIsDirty } from "../../shared/hooks/useIsDirty";
import { useUnsavedChangesWarning } from "../../shared/hooks/useUnsavedChangesWarning";
import { PlayerManagementSection, type EditablePlayer } from "./components/PlayerManagementSection";
import { TeamEditorForm, type TeamEditorValues } from "./components/TeamEditorForm";
import "./ManageTeamPage.css";

const defaultProfileRating = {
  defense: 5,
  offense: 5,
  consistency: 5,
  cohesion: 5,
  depth: 5
};

function getSlugFromPath() {
  const match = window.location.pathname.match(/^\/teams\/([^/]+)\/manage\/?$/);
  return match?.[1] ?? "";
}

function teamToForm(team: TeamDetail): TeamEditorValues {
  return {
    name: team.name,
    divisionId: team.divisionId,
    logoUrl: team.logoUrl ?? "",
    primaryColor: team.primaryColor ?? "#3B82F6",
    overallRating: team.overallRating ?? 0,
    description: team.description ?? "",
    profileRating: team.profileRating ?? defaultProfileRating
  };
}

function teamPlayersToEditable(team: TeamDetail): EditablePlayer[] {
  return team.players.map((player) => ({
    id: player.id,
    localId: String(player.id),
    name: player.name,
    number: player.number,
    position: player.position,
    isActive: player.isActive
  }));
}

function mapErrors(error: ApiClientError) {
  return Object.fromEntries(error.response.details.map((detail) => [detail.field, detail.message]));
}

function buildPayload(team: TeamEditorValues, players: EditablePlayer[]): TeamMutationPayload {
  const playerPayload: TeamPlayerPayload[] = players.map((player) => {
    if (player.pendingRemoval && player.id !== undefined) {
      return { id: player.id, isActive: false };
    }

    return {
      ...(player.id !== undefined ? { id: player.id } : {}),
      name: player.name,
      number: player.number,
      position: player.position,
      isActive: true
    };
  });

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

export function ManageTeamPage() {
  const slug = getSlugFromPath();
  const [loadedTeam, setLoadedTeam] = useState<TeamDetail | null>(null);
  const [team, setTeam] = useState<TeamEditorValues | null>(null);
  const [players, setPlayers] = useState<EditablePlayer[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageError, setPageError] = useState<string | null>(null);
  const [rosterError, setRosterError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setPageError(null);
    Promise.all([fetchTeam(slug, controller.signal), fetchDivisions(controller.signal)])
      .then(([teamResponse, divisionResponse]) => {
        setLoadedTeam(teamResponse);
        setTeam(teamToForm(teamResponse));
        setPlayers(teamPlayersToEditable(teamResponse));
        setDivisions(divisionResponse.divisions);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setPageError(error instanceof Error ? error.message : "Unable to load team.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [slug]);

  async function handleSave() {
    if (team === null) {
      return;
    }

    setErrors({});
    setPageError(null);
    setRosterError(null);

    const activeNumbers = new Set<number>();
    for (const player of players.filter((item) => !item.pendingRemoval)) {
      if (activeNumbers.has(player.number)) {
        setRosterError("Active player numbers must be unique.");
        return;
      }
      activeNumbers.add(player.number);
    }

    setIsSubmitting(true);
    try {
      const updatedTeam = await updateTeam(slug, buildPayload(team, players));
      allowUnload();
      window.location.href = `/teams/${updatedTeam.slug}`;
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrors(mapErrors(error));
        if (error.response.error === "TEAM_ARCHIVED") {
          setPageError("This team is archived and cannot be edited.");
        } else if (error.response.error === "PLAYER_NUMBER_CONFLICT") {
          setRosterError(error.response.message);
        } else if (error.response.details.length === 0) {
          setPageError(error.response.message);
        }
      } else {
        setPageError(error instanceof Error ? error.message : "Unable to save team.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    setIsSubmitting(true);
    setArchiveError(null);
    setPageError(null);
    try {
      await archiveTeam(slug);
      setShowArchiveConfirm(false);
      allowUnload();
      window.location.href = "/teams";
    } catch (error) {
      if (error instanceof ApiClientError) {
        setArchiveError(error.response.message);
        setPageError(error.response.message);
      } else {
        const message = error instanceof Error ? error.message : "Unable to archive team.";
        setArchiveError(message);
        setPageError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isArchived = loadedTeam?.archivedAt !== null && loadedTeam?.archivedAt !== undefined;
  const dirty = useIsDirty(JSON.stringify({ team, players }), !isLoading && team !== null && !isArchived);
  const allowUnload = useUnsavedChangesWarning(dirty);

  return (
    <Stack className="manage-team-page" gap="lg">
      <Group align="flex-start" className="manage-team-header" justify="space-between">
        <Box>
          <Title className="page-title" order={1}>
            Manage Team
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Update team identity, ratings, and roster settings.
          </Text>
        </Box>

        <Group gap="sm">
          <Button
            className="manage-team-save-button app-action-button app-action-button--primary"
            disabled={isArchived || team === null}
            loading={isSubmitting}
            onClick={() => void handleSave()}
          >
            Save Changes
          </Button>
          <Button
            className="manage-team-cancel-button app-action-button app-action-button--cancel"
            component="a"
            href={`/teams/${slug}`}
            variant="outline"
          >
            Cancel
          </Button>
        </Group>
      </Group>

      {pageError ? <Alert color="red">{pageError}</Alert> : null}
      {isArchived ? (
        <Alert color="yellow" title="Archived team">
          This team is read-only. Return to the detail page to view historical data.
        </Alert>
      ) : null}

      {isLoading || team === null ? (
        <Skeleton className="manage-team-loading-skeleton" height={380} />
      ) : (
        <>
          <TeamEditorForm
            disabled={isSubmitting || isArchived}
            divisions={divisions}
            errors={errors}
            onChange={setTeam}
            value={team}
          />

          <PlayerManagementSection
            disabled={isSubmitting || isArchived}
            errors={errors}
            onChange={setPlayers}
            rosterError={rosterError}
            value={players}
          />

          <Box className="manage-team-section app-surface app-surface--editor">
            <Title order={2}>Archive Team</Title>
            <Text className="module-copy">
              Archiving is not reversible in this MVP. The team is removed from the default list and historical data is retained.
            </Text>
            <Button
              className="app-action-button app-action-button--danger"
              disabled={isArchived}
              mt="md"
              onClick={() => { setArchiveError(null); setShowArchiveConfirm(true); }}
              variant="outline"
            >
              Archive Team
            </Button>
          </Box>
        </>
      )}

      <ConfirmModal
        confirmLabel="Archive Team"
        danger
        error={archiveError}
        loading={isSubmitting}
        onCancel={() => setShowArchiveConfirm(false)}
        onConfirm={() => void handleArchive()}
        opened={showArchiveConfirm}
        title="Archive Team"
      >
        Archiving is not reversible in this MVP. This team will be removed from the default list; its historical stats remain available.
      </ConfirmModal>
    </Stack>
  );
}
