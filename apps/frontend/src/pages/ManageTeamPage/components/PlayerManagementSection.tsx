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

type PlayerPosition = "PG" | "SG" | "G" | "F" | "SF" | "PF" | "C";

type Player = {
  id: string;
  number: number;
  position: PlayerPosition;
  name: string;
};

type PlayerFormValues = {
  number: number | "";
  position: PlayerPosition | "";
  name: string;
};

const positionOptions: PlayerPosition[] = ["PG", "SG", "G", "F", "SF", "PF", "C"];

const mockPlayers: Player[] = [
  {
    id: "mason-cole",
    number: 7,
    position: "G",
    name: "Mason Cole"
  },
  {
    id: "eli-brooks",
    number: 12,
    position: "F",
    name: "Eli Brooks"
  }
];

const emptyPlayerForm: PlayerFormValues = {
  number: "",
  position: "",
  name: ""
};

function getPlayerFormValues(player: Player): PlayerFormValues {
  return {
    number: player.number,
    position: player.position,
    name: player.name
  };
}

export function PlayerManagementSection() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PlayerFormValues>(emptyPlayerForm);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const isEditing = editingPlayerId !== null;
  const isNumberInvalid = formValues.number === "";
  const isPositionInvalid = formValues.position === "";
  const isNameInvalid = formValues.name.trim().length === 0;

  function handleAddPlayer() {
    setEditingPlayerId(null);
    setFormValues(emptyPlayerForm);
    setShowValidation(false);
    setShowPlayerForm(true);
  }

  function handleEditPlayer(player: Player) {
    setEditingPlayerId(player.id);
    setFormValues(getPlayerFormValues(player));
    setShowValidation(false);
    setShowPlayerForm(true);
  }

  function handleCancelPlayerForm() {
    setEditingPlayerId(null);
    setFormValues(emptyPlayerForm);
    setShowValidation(false);
    setShowPlayerForm(false);
  }

  function handleSavePlayer() {
    setShowValidation(true);

    if (formValues.number === "" || formValues.position === "" || formValues.name.trim().length === 0) {
      return;
    }

    const playerPayload: Player = {
      id: editingPlayerId ?? `player-${Date.now()}`,
      number: Number(formValues.number),
      position: formValues.position,
      name: formValues.name.trim()
    };

    setPlayers((currentPlayers) => {
      if (editingPlayerId) {
        return currentPlayers.map((player) =>
          player.id === editingPlayerId ? playerPayload : player
        );
      }

      return [...currentPlayers, playerPayload];
    });

    handleCancelPlayerForm();
  }

  function handleRemovePlayer(playerId: string) {
    setPlayers((currentPlayers) => currentPlayers.filter((player) => player.id !== playerId));

    if (editingPlayerId === playerId) {
      handleCancelPlayerForm();
    }
  }

  return (
    <Box className="manage-team-section">
      <Group align="flex-start" className="player-management-header" justify="space-between">
        <Box>
          <Title order={2}>Player Management</Title>
          <Text className="module-copy">Manage players assigned to this team.</Text>
        </Box>

        <Button className="player-add-button" onClick={handleAddPlayer}>
          + Add Player
        </Button>
      </Group>

      {showPlayerForm ? (
        <Box className="player-inline-form">
          <Text className="data-label">{isEditing ? "Edit Player" : "Add Player"}</Text>
          <Box className="player-form-grid">
            <NumberInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              clampBehavior="strict"
              error={showValidation && isNumberInvalid ? "Number is required" : undefined}
              label="Number"
              min={0}
              onChange={(value) => {
                setFormValues((currentValues) => ({
                  ...currentValues,
                  number: typeof value === "number" ? value : ""
                }));
              }}
              value={formValues.number}
            />

            <Select
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              data={positionOptions}
              error={showValidation && isPositionInvalid ? "Position is required" : undefined}
              label="Position"
              onChange={(value) => {
                setFormValues((currentValues) => ({
                  ...currentValues,
                  position: (value ?? "") as PlayerPosition | ""
                }));
              }}
              value={formValues.position || null}
            />

            <TextInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              error={showValidation && isNameInvalid ? "Name is required" : undefined}
              label="Name"
              onChange={(event) => {
                const name = event.currentTarget.value;

                setFormValues((currentValues) => ({
                  ...currentValues,
                  name
                }));
              }}
              value={formValues.name}
            />
          </Box>

          <Group gap="sm" mt="md">
            <Button className="player-save-button" onClick={handleSavePlayer}>
              Save Player
            </Button>
            <Button className="player-cancel-button" onClick={handleCancelPlayerForm} variant="outline">
              Cancel
            </Button>
          </Group>
        </Box>
      ) : null}

      <Box className="player-table-wrap">
        <Table className="player-management-table" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>POS</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th className="player-actions-cell">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.map((player) => (
              <Table.Tr key={player.id}>
                <Table.Td>{player.number}</Table.Td>
                <Table.Td>{player.position}</Table.Td>
                <Table.Td>{player.name}</Table.Td>
                <Table.Td className="player-actions-cell">
                  <Group gap="xs" justify="flex-end">
                    <Button
                      className="player-table-action"
                      onClick={() => handleEditPlayer(player)}
                      size="xs"
                      variant="subtle"
                    >
                      Edit
                    </Button>
                    <Button
                      className="player-table-action danger"
                      onClick={() => handleRemovePlayer(player.id)}
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
