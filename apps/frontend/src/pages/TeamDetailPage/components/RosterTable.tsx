import { Anchor, Box, Table, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import {
  comparePlayerPositions,
  compareSortableValues,
  type PlayerPosition,
  type SortDirection
} from "../../../shared/utils/playerSorting";

export type Player = {
  id: string;
  slug: string;
  number: number;
  position: PlayerPosition;
  name: string;
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  averageMinutes: number;
  starRating: number;
};

type RosterTableProps = {
  players: Player[];
};

type SortKey = keyof Omit<Player, "id">;

type Column = {
  key: SortKey;
  label: string;
  className?: string;
  render: (player: Player) => string;
};

const columns: Column[] = [
  {
    key: "number",
    label: "#",
    className: "roster-column-number",
    render: (player) => String(player.number)
  },
  {
    key: "position",
    label: "POS",
    className: "roster-column-position",
    render: (player) => player.position
  },
  { key: "name", label: "Player", render: (player) => player.name },
  { key: "points", label: "PTS", render: (player) => player.points.toFixed(1) },
  {
    key: "rebounds",
    label: "REB",
    render: (player) => player.rebounds.toFixed(1)
  },
  {
    key: "assists",
    label: "AST",
    render: (player) => player.assists.toFixed(1)
  },
  {
    key: "fieldGoalPercentage",
    label: "FG%",
    render: (player) => `${player.fieldGoalPercentage.toFixed(1)}%`
  },
  {
    key: "threePointPercentage",
    label: "3P%",
    render: (player) => `${player.threePointPercentage.toFixed(1)}%`
  },
  {
    key: "averageMinutes",
    label: "MIN",
    render: (player) => player.averageMinutes.toFixed(1)
  },
  { key: "starRating", label: "Rating", render: (player) => player.starRating.toFixed(1) }
];

function comparePlayers(firstPlayer: Player, secondPlayer: Player, sortKey: SortKey) {
  if (sortKey === "position") {
    return comparePlayerPositions(firstPlayer.position, secondPlayer.position);
  }

  return compareSortableValues(firstPlayer[sortKey], secondPlayer[sortKey]);
}

export function RosterTable({ players }: RosterTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedPlayers = useMemo(() => {
    return [...players].sort((firstPlayer, secondPlayer) => {
      const comparison = comparePlayers(firstPlayer, secondPlayer, sortKey);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [players, sortDirection, sortKey]);

  function handleSort(nextSortKey: SortKey) {
    if (nextSortKey === sortKey) {
      setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
  }

  return (
    <Box className="roster-table-card app-data-bay">
      <Title order={2}>Roster</Title>
      <Box className="roster-table-scroll app-table-wrap">
        <Table className="roster-table app-data-table" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => {
                const isActiveSort = column.key === sortKey;
                const sortIndicator = isActiveSort && sortDirection === "asc" ? "\u2191" : "\u2193";

                return (
                  <Table.Th
                    aria-sort={
                      isActiveSort
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    className={column.className}
                    key={column.key}
                  >
                    <button
                      className="roster-sort-button app-sort-control"
                      onClick={() => handleSort(column.key)}
                      type="button"
                    >
                      <span>{column.label}</span>
                      <span aria-hidden="true" className="roster-sort-indicator app-sort-control__indicator">
                        {isActiveSort ? sortIndicator : ""}
                      </span>
                    </button>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedPlayers.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text className="roster-value">No active players.</Text>
                </Table.Td>
              </Table.Tr>
            ) : sortedPlayers.map((player) => (
              <Table.Tr key={player.id}>
                {columns.map((column) => (
                  <Table.Td className={column.className} key={column.key}>
                    {column.key === "name" ? (
                      <Anchor className="roster-player-link" href={`/players/${player.slug}`}>
                        {column.render(player)}
                      </Anchor>
                    ) : (
                      <Text className="roster-value">
                        {column.render(player)}
                      </Text>
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
