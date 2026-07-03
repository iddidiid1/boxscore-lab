import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useState } from "react";
import type { PlayerPosition } from "../../../features/teams";

export type EditablePlayer = {
  id?: number;
  localId: string;
  number: number;
  position: PlayerPosition;
  name: string;
  isActive: boolean;
  pendingRemoval?: boolean;
};

type PlayerFormValues = {
  number: number | "";
  position: PlayerPosition | "";
  name: string;
};

type PlayerManagementSectionProps = {
  value: EditablePlayer[];
  onChange: (value: EditablePlayer[]) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  rosterError?: string | null;
};

const positionOptions: PlayerPosition[] = ["PG", "SG", "G", "F", "SF", "PF", "C"];

const emptyPlayerForm: PlayerFormValues = {
  number: "",
  position: "",
  name: ""
};

function getPlayerFormValues(player: EditablePlayer): PlayerFormValues {
  return {
    number: player.number,
    position: player.position,
    name: player.name
  };
}

export function PlayerManagementSection({
  value,
  onChange,
  errors = {},
  disabled = false,
  rosterError = null
}: PlayerManagementSectionProps) {
  const [editingPlayerLocalId, setEditingPlayerLocalId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PlayerFormValues>(emptyPlayerForm);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const visiblePlayers = value.filter((player) => !player.pendingRemoval);
  const isEditing = editingPlayerLocalId !== null;
  const isNumberInvalid = formValues.number === "";
  const isPositionInvalid = formValues.position === "";
  const isNameInvalid = formValues.name.trim().length === 0;

  function handleAddPlayer() {
    setEditingPlayerLocalId(null);
    setFormValues(emptyPlayerForm);
    setShowValidation(false);
    setShowPlayerForm(true);
  }

  function handleEditPlayer(player: EditablePlayer) {
    setEditingPlayerLocalId(player.localId);
    setFormValues(getPlayerFormValues(player));
    setShowValidation(false);
    setShowPlayerForm(true);
  }

  function handleCancelPlayerForm() {
    setEditingPlayerLocalId(null);
    setFormValues(emptyPlayerForm);
    setShowValidation(false);
    setShowPlayerForm(false);
  }

  function handleSavePlayer() {
    setShowValidation(true);

    if (formValues.number === "" || formValues.position === "" || formValues.name.trim().length === 0) {
      return;
    }

    const playerPayload: EditablePlayer = {
      localId: editingPlayerLocalId ?? `new-${Date.now()}`,
      number: Number(formValues.number),
      position: formValues.position,
      name: formValues.name.trim(),
      isActive: true
    };

    onChange(
      editingPlayerLocalId
        ? value.map((player) =>
            player.localId === editingPlayerLocalId
              ? { ...player, ...playerPayload, id: player.id }
              : player
          )
        : [...value, playerPayload]
    );

    handleCancelPlayerForm();
  }

  function handleRemovePlayer(player: EditablePlayer) {
    onChange(
      player.id === undefined
        ? value.filter((currentPlayer) => currentPlayer.localId !== player.localId)
        : value.map((currentPlayer) =>
            currentPlayer.localId === player.localId
              ? { ...currentPlayer, isActive: false, pendingRemoval: true }
              : currentPlayer
          )
    );

    if (editingPlayerLocalId === player.localId) {
      handleCancelPlayerForm();
    }
  }

  function fieldError(player: EditablePlayer, field: "number" | "name" | "position") {
    const visibleIndex = visiblePlayers.findIndex((currentPlayer) => currentPlayer.localId === player.localId);
    return visibleIndex >= 0 ? errors[`players[${visibleIndex}].${field}`] : undefined;
  }

  return (
    <Box className="manage-team-section app-panel">
      <Group align="flex-start" className="player-management-header" justify="space-between">
        <Box>
          <Title order={2}>Player Management</Title>
          <Text className="module-copy">Manage players assigned to this team.</Text>
          {rosterError ? <Text className="app-field-error">{rosterError}</Text> : null}
        </Box>

        <Button className="player-add-button app-action-button app-action-button--primary" disabled={disabled} onClick={handleAddPlayer}>
          + Add Player
        </Button>
      </Group>

      {showPlayerForm ? (
        <Box className="player-inline-form app-panel app-panel--inset">
          <Text className="data-label">{isEditing ? "Edit Player" : "Add Player"}</Text>
          <Box className="player-form-grid">
            <NumberInput
              classNames={{ input: "manage-team-input app-control-input", label: "manage-team-input-label app-control-label" }}
              clampBehavior="strict"
              disabled={disabled}
              error={showValidation && isNumberInvalid ? "Number is required" : undefined}
              label="Number"
              max={99}
              min={0}
              onChange={(nextValue) => {
                setFormValues((currentValues) => ({
                  ...currentValues,
                  number: typeof nextValue === "number" ? nextValue : ""
                }));
              }}
              value={formValues.number}
            />

            <Select
              classNames={{ input: "manage-team-input app-control-input", label: "manage-team-input-label app-control-label" }}
              data={positionOptions}
              disabled={disabled}
              error={showValidation && isPositionInvalid ? "Position is required" : undefined}
              label="Position"
              onChange={(nextValue) => {
                setFormValues((currentValues) => ({
                  ...currentValues,
                  position: (nextValue ?? "") as PlayerPosition | ""
                }));
              }}
              value={formValues.position || null}
            />

            <TextInput
              classNames={{ input: "manage-team-input app-control-input", label: "manage-team-input-label app-control-label" }}
              disabled={disabled}
              error={showValidation && isNameInvalid ? "Name is required" : undefined}
              label="Name"
              onChange={(event) => {
                const nextName = event.currentTarget.value;
                setFormValues((currentValues) => ({
                  ...currentValues,
                  name: nextName
                }));
              }}
              value={formValues.name}
            />
          </Box>

          <Group gap="sm" mt="md">
            <Button className="player-save-button app-action-button app-action-button--primary" disabled={disabled} onClick={handleSavePlayer}>
              Save Player
            </Button>
            <Button className="player-cancel-button app-action-button app-action-button--secondary" onClick={handleCancelPlayerForm} variant="outline">
              Cancel
            </Button>
          </Group>
        </Box>
      ) : null}

      <Box className="player-table-wrap app-table-wrap">
        <Table className="player-management-table app-data-table" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>POS</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th className="player-actions-cell">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visiblePlayers.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>No active players.</Table.Td>
              </Table.Tr>
            ) : visiblePlayers.map((player) => (
              <Table.Tr key={player.localId}>
                <Table.Td>
                  {player.number}
                  {fieldError(player, "number") ? <Text className="app-field-error">{fieldError(player, "number")}</Text> : null}
                </Table.Td>
                <Table.Td>
                  {player.position}
                  {fieldError(player, "position") ? <Text className="app-field-error">{fieldError(player, "position")}</Text> : null}
                </Table.Td>
                <Table.Td>
                  {player.name}
                  {fieldError(player, "name") ? <Text className="app-field-error">{fieldError(player, "name")}</Text> : null}
                </Table.Td>
                <Table.Td className="player-actions-cell">
                  <Group gap="xs" justify="flex-end">
                    <Button
                      className="player-table-action app-action-button app-action-button--quiet"
                      disabled={disabled}
                      onClick={() => handleEditPlayer(player)}
                      size="xs"
                      variant="subtle"
                    >
                      Edit
                    </Button>
                    <Button
                      className="player-table-action app-action-button app-action-button--danger"
                      disabled={disabled}
                      onClick={() => handleRemovePlayer(player)}
                      size="xs"
                      variant="subtle"
                    >
                      Remove
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
