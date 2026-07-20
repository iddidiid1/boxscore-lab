import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { Check } from "lucide-react";

export type EventParticipantTeam = {
  id: string;
  name: string;
};

type EventParticipantsSelectorProps = {
  onChange: (selectedTeamIds: string[]) => void;
  selectedTeamIds: string[];
  teams: EventParticipantTeam[];
};

export function EventParticipantsSelector({
  onChange,
  selectedTeamIds,
  teams
}: EventParticipantsSelectorProps) {
  const selectedSet = new Set(selectedTeamIds);

  function toggleTeam(teamId: string) {
    if (selectedSet.has(teamId)) {
      onChange(selectedTeamIds.filter((selectedTeamId) => selectedTeamId !== teamId));
      return;
    }

    onChange([...selectedTeamIds, teamId]);
  }

  return (
    <Box className="event-form-panel app-surface app-surface--editor">
      <Stack gap="md">
        <Group align="flex-start" justify="space-between">
          <Box>
            <Text className="event-form-kicker">Roster scope</Text>
            <Title className="event-form-title" order={2}>
              Participating Teams
            </Title>
          </Box>

          <Group className="event-participants-actions" gap="xs">
            <Text className="event-participants-count">
              {selectedTeamIds.length} / {teams.length} selected
            </Text>
            <Button
              className="event-form-quiet-button app-action-button app-action-button--small-edit"
              onClick={() => onChange(teams.map((team) => team.id))}
              type="button"
              variant="subtle"
            >
              Select All
            </Button>
            <Button
              className="event-form-quiet-button app-action-button app-action-button--small-edit"
              onClick={() => onChange([])}
              type="button"
              variant="subtle"
            >
              Clear All
            </Button>
          </Group>
        </Group>

        <Group className="event-participants-chip-grid" gap="xs">
          {teams.map((team) => {
            const isSelected = selectedSet.has(team.id);

            return (
              <button
                className="event-participant-chip"
                data-selected={isSelected || undefined}
                key={team.id}
                onClick={() => toggleTeam(team.id)}
                type="button"
              >
                {isSelected ? <Check size={13} /> : null}
                <span>{team.name}</span>
              </button>
            );
          })}
        </Group>
      </Stack>
    </Box>
  );
}
