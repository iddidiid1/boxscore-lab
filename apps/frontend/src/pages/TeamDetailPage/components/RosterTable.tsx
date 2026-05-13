import { Box, Table, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";

export type PlayerPosition = "PG" | "SG" | "G" | "F" | "SF" | "PF" | "C";

export type Player = {
  id: string;
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

type SortDirection = "asc" | "desc";
type SortKey = keyof Omit<Player, "id">;

type Column = {
  key: SortKey;
  label: string;
  className?: string;
  render: (player: Player) => string;
};

const positionSortRank: Record<PlayerPosition, number> = {
  PG: 0,
  SG: 1,
  G: 2,
  F: 3,
  SF: 4,
  PF: 5,
  C: 6
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
  { key: "starRating", label: "Rating", render: (player) => getStars(player.starRating) }
];

function getStars(rating: number) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"\u2605".repeat(roundedRating)}${"\u2606".repeat(5 - roundedRating)}`;
}

function comparePlayers(firstPlayer: Player, secondPlayer: Player, sortKey: SortKey) {
  if (sortKey === "position") {
    return positionSortRank[firstPlayer.position] - positionSortRank[secondPlayer.position];
  }

  const firstValue = firstPlayer[sortKey];
  const secondValue = secondPlayer[sortKey];

  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(String(secondValue));
}

export function RosterTable({ players }: RosterTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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
    <Box className="roster-table-card">
      <Title order={2}>Roster</Title>
      <Box className="roster-table-scroll">
        <Table className="roster-table" highlightOnHover>
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
                      className="roster-sort-button"
                      onClick={() => handleSort(column.key)}
                      type="button"
                    >
                      <span>{column.label}</span>
                      <span aria-hidden="true" className="roster-sort-indicator">
                        {isActiveSort ? sortIndicator : ""}
                      </span>
                    </button>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedPlayers.map((player) => (
              <Table.Tr key={player.id}>
                {columns.map((column) => (
                  <Table.Td className={column.className} key={column.key}>
                    <Text
                      className={column.key === "starRating" ? "roster-rating" : "roster-value"}
                    >
                      {column.render(player)}
                    </Text>
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
