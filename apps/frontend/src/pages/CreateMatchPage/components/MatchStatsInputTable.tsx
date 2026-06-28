import { Box, NumberInput, Table, Text, Title } from "@mantine/core";
import { useMemo } from "react";
import { comparePlayersByPositionThenName } from "../../../shared/utils/playerSorting";
import { MATCH_OTHER_PLAYER_ID, type MatchFormTeam, type PlayerStatInput } from "../types";

type MatchStatsInputTableProps = {
  statsByPlayerId: Record<string, PlayerStatInput>;
  team: MatchFormTeam;
  onPlayerStatChange: (
    playerId: string,
    statKey: keyof PlayerStatInput,
    value: number
  ) => void;
};

const editableStatColumns: Array<{
  key: keyof PlayerStatInput;
  label: string;
  decimalScale?: number;
  step?: number;
}> = [
  { key: "points", label: "PTS" },
  { key: "rebounds", label: "REB" },
  { key: "assists", label: "AST" },
  { key: "fieldGoalsMade", label: "FGM" },
  { key: "fieldGoalsAttempted", label: "FGA" },
  { key: "threePointersMade", label: "3PM" },
  { key: "threePointersAttempted", label: "3PA" },
  { key: "minutes", label: "MIN", decimalScale: 1, step: 0.5 },
  { key: "rating", label: "RTG", decimalScale: 1, step: 0.1 }
];

function getPercentage(made: number, attempted: number) {
  if (attempted <= 0) {
    return "-";
  }

  return `${((made / attempted) * 100).toFixed(1)}%`;
}

function toNumber(value: string | number) {
  return typeof value === "number" ? value : Number(value) || 0;
}

function createEmptyStats(): PlayerStatInput {
  return {
    points: 0,
    rebounds: 0,
    assists: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0,
    minutes: 0,
    rating: 0
  };
}

export function MatchStatsInputTable({
  statsByPlayerId,
  team,
  onPlayerStatChange
}: MatchStatsInputTableProps) {
  const sortedPlayers = useMemo(
    () => [...team.players].sort(comparePlayersByPositionThenName),
    [team.players]
  );
  const tableRows = useMemo(
    () => [
      ...sortedPlayers,
      {
        id: MATCH_OTHER_PLAYER_ID,
        name: "Other",
        position: "-"
      }
    ],
    [sortedPlayers]
  );
  const teamScore = tableRows.reduce(
    (totalPoints, player) => totalPoints + (statsByPlayerId[player.id]?.points ?? 0),
    0
  );

  return (
    <Box className="match-form-section match-stats-section app-panel">
      <Title className="match-stats-title" order={2}>
        <span
          aria-hidden="true"
          className="match-stats-title-bar"
          style={{ backgroundColor: team.color }}
        />
        <span>{team.name}</span>
        <span className="match-stats-score">Score {teamScore}</span>
      </Title>
      <Box className="match-stats-table-scroll">
        <Table className="match-stats-input-table">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>POS</Table.Th>
              <Table.Th>Player</Table.Th>
              {editableStatColumns.slice(0, 5).map((column) => (
                <Table.Th key={column.key}>{column.label}</Table.Th>
              ))}
              <Table.Th>FG%</Table.Th>
              {editableStatColumns.slice(5, 7).map((column) => (
                <Table.Th key={column.key}>{column.label}</Table.Th>
              ))}
              <Table.Th>3P%</Table.Th>
              {editableStatColumns.slice(7).map((column) => (
                <Table.Th key={column.key}>{column.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tableRows.map((player) => {
              const stats = statsByPlayerId[player.id] ?? createEmptyStats();
              const isOtherRow = player.id === MATCH_OTHER_PLAYER_ID;

              return (
                <Table.Tr className={isOtherRow ? "match-stats-other-row" : undefined} key={player.id}>
                  <Table.Td>
                    <Text className="match-stats-readonly-value">{player.position}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text className="match-stats-player-name">{player.name}</Text>
                  </Table.Td>
                  {editableStatColumns.slice(0, 5).map((column) => (
                    <Table.Td key={column.key}>
                      <NumberInput
                        allowDecimal={Boolean(column.decimalScale)}
                        classNames={{ input: "match-stats-input" }}
                        decimalScale={column.decimalScale}
                        min={0}
                        onChange={(value) =>
                          onPlayerStatChange(player.id, column.key, toNumber(value))
                        }
                        step={column.step ?? 1}
                        value={stats[column.key]}
                      />
                    </Table.Td>
                  ))}
                  <Table.Td>
                    <Text className="match-stats-calculated-value">
                      {getPercentage(stats.fieldGoalsMade, stats.fieldGoalsAttempted)}
                    </Text>
                  </Table.Td>
                  {editableStatColumns.slice(5, 7).map((column) => (
                    <Table.Td key={column.key}>
                      <NumberInput
                        classNames={{ input: "match-stats-input" }}
                        min={0}
                        onChange={(value) =>
                          onPlayerStatChange(player.id, column.key, toNumber(value))
                        }
                        step={1}
                        value={stats[column.key]}
                      />
                    </Table.Td>
                  ))}
                  <Table.Td>
                    <Text className="match-stats-calculated-value">
                      {getPercentage(stats.threePointersMade, stats.threePointersAttempted)}
                    </Text>
                  </Table.Td>
                  {editableStatColumns.slice(7).map((column) => (
                    <Table.Td key={column.key}>
                      <NumberInput
                        allowDecimal
                        classNames={{ input: "match-stats-input" }}
                        decimalScale={column.decimalScale}
                        min={0}
                        onChange={(value) =>
                          onPlayerStatChange(player.id, column.key, toNumber(value))
                        }
                        step={column.step}
                        value={stats[column.key]}
                      />
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
