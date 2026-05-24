import { Box, Table, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import {
  comparePlayersByPositionThenName,
  comparePlayerPositions,
  compareSortableValues,
  type SortDirection
} from "../../../shared/utils/playerSorting";
import type { BoxScoreOtherStats, BoxScorePlayer } from "../types";

type MatchBoxScoreTableProps = {
  otherStats?: BoxScoreOtherStats;
  players: BoxScorePlayer[];
  teamColor: string;
  title: string;
};

type BoxScoreDisplayRow = {
  id: string;
  rowType: "player" | "other" | "total";
  position: string;
  name: string;
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalPercentage: number;
  threePointersMade: number;
  threePointersAttempted: number;
  threePointPercentage: number;
  minutes: string;
  rating: string;
};

const columns: Array<{
  key: keyof Omit<BoxScoreDisplayRow, "id" | "rowType">;
  label: string;
  className?: string;
  render: (row: BoxScoreDisplayRow) => string;
}> = [
  {
    key: "position",
    label: "POS",
    className: "box-score-column-position",
    render: (player) => player.position
  },
  { key: "name", label: "Player", render: (player) => player.name },
  { key: "points", label: "PTS", render: (player) => String(player.points) },
  { key: "rebounds", label: "REB", render: (player) => String(player.rebounds) },
  { key: "assists", label: "AST", render: (player) => String(player.assists) },
  { key: "fieldGoalsMade", label: "FGM", render: (player) => String(player.fieldGoalsMade) },
  {
    key: "fieldGoalsAttempted",
    label: "FGA",
    render: (player) => String(player.fieldGoalsAttempted)
  },
  {
    key: "fieldGoalPercentage",
    label: "FG%",
    render: (row) => `${row.fieldGoalPercentage.toFixed(1)}%`
  },
  {
    key: "threePointersMade",
    label: "3PM",
    render: (player) => String(player.threePointersMade)
  },
  {
    key: "threePointersAttempted",
    label: "3PA",
    render: (player) => String(player.threePointersAttempted)
  },
  {
    key: "threePointPercentage",
    label: "3P%",
    render: (row) => `${row.threePointPercentage.toFixed(1)}%`
  },
  { key: "minutes", label: "MIN", render: (row) => row.minutes },
  { key: "rating", label: "RATING", render: (row) => row.rating }
];

type SortKey = (typeof columns)[number]["key"];

function getDefaultSortDirection(sortKey: SortKey): SortDirection {
  return sortKey === "name" || sortKey === "position" ? "asc" : "desc";
}

function compareBoxScorePlayers(
  firstPlayer: BoxScorePlayer,
  secondPlayer: BoxScorePlayer,
  sortKey: SortKey
) {
  if (sortKey === "position") {
    return comparePlayerPositions(firstPlayer.position, secondPlayer.position);
  }

  return compareSortableValues(firstPlayer[sortKey], secondPlayer[sortKey]);
}

function getPercentage(made: number, attempted: number) {
  if (attempted <= 0) {
    return 0;
  }

  return (made / attempted) * 100;
}

function getEmptyOtherStats(): BoxScoreOtherStats {
  return {
    points: 0,
    rebounds: 0,
    assists: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0
  };
}

function toPlayerDisplayRow(player: BoxScorePlayer): BoxScoreDisplayRow {
  return {
    ...player,
    rowType: "player",
    minutes: player.minutes.toFixed(1),
    rating: player.rating.toFixed(1)
  };
}

function toOtherDisplayRow(otherStats: BoxScoreOtherStats): BoxScoreDisplayRow {
  return {
    id: "match-only-other",
    rowType: "other",
    position: "-",
    name: "Other",
    points: otherStats.points,
    rebounds: otherStats.rebounds,
    assists: otherStats.assists,
    fieldGoalsMade: otherStats.fieldGoalsMade,
    fieldGoalsAttempted: otherStats.fieldGoalsAttempted,
    fieldGoalPercentage: getPercentage(otherStats.fieldGoalsMade, otherStats.fieldGoalsAttempted),
    threePointersMade: otherStats.threePointersMade,
    threePointersAttempted: otherStats.threePointersAttempted,
    threePointPercentage: getPercentage(
      otherStats.threePointersMade,
      otherStats.threePointersAttempted
    ),
    minutes: "-",
    rating: "-"
  };
}

function toTotalDisplayRow(
  players: BoxScorePlayer[],
  otherStats: BoxScoreOtherStats
): BoxScoreDisplayRow {
  const totals = players.reduce(
    (currentTotals, player) => ({
      points: currentTotals.points + player.points,
      rebounds: currentTotals.rebounds + player.rebounds,
      assists: currentTotals.assists + player.assists,
      fieldGoalsMade: currentTotals.fieldGoalsMade + player.fieldGoalsMade,
      fieldGoalsAttempted: currentTotals.fieldGoalsAttempted + player.fieldGoalsAttempted,
      threePointersMade: currentTotals.threePointersMade + player.threePointersMade,
      threePointersAttempted:
        currentTotals.threePointersAttempted + player.threePointersAttempted,
      rating: currentTotals.rating + player.rating
    }),
    {
      points: otherStats.points,
      rebounds: otherStats.rebounds,
      assists: otherStats.assists,
      fieldGoalsMade: otherStats.fieldGoalsMade,
      fieldGoalsAttempted: otherStats.fieldGoalsAttempted,
      threePointersMade: otherStats.threePointersMade,
      threePointersAttempted: otherStats.threePointersAttempted,
      rating: 0
    }
  );
  const averageRating = players.length > 0 ? totals.rating / players.length : 0;

  return {
    id: "team-total",
    rowType: "total",
    position: "",
    name: "Total",
    points: totals.points,
    rebounds: totals.rebounds,
    assists: totals.assists,
    fieldGoalsMade: totals.fieldGoalsMade,
    fieldGoalsAttempted: totals.fieldGoalsAttempted,
    fieldGoalPercentage: getPercentage(totals.fieldGoalsMade, totals.fieldGoalsAttempted),
    threePointersMade: totals.threePointersMade,
    threePointersAttempted: totals.threePointersAttempted,
    threePointPercentage: getPercentage(totals.threePointersMade, totals.threePointersAttempted),
    minutes: "-",
    rating: players.length > 0 ? averageRating.toFixed(1) : "-"
  };
}

export function MatchBoxScoreTable({
  otherStats = getEmptyOtherStats(),
  players,
  teamColor,
  title
}: MatchBoxScoreTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedPlayers = useMemo(() => {
    return [...players].sort((firstPlayer, secondPlayer) => {
      if (!sortKey) {
        return comparePlayersByPositionThenName(firstPlayer, secondPlayer);
      }

      const comparison = compareBoxScorePlayers(firstPlayer, secondPlayer, sortKey);
      const directedComparison = sortDirection === "asc" ? comparison : -comparison;

      if (directedComparison !== 0) {
        return directedComparison;
      }

      return comparePlayersByPositionThenName(firstPlayer, secondPlayer);
    });
  }, [players, sortDirection, sortKey]);
  const displayRows = useMemo(
    () => [
      ...sortedPlayers.map(toPlayerDisplayRow),
      toOtherDisplayRow(otherStats),
      toTotalDisplayRow(players, otherStats)
    ],
    [otherStats, players, sortedPlayers]
  );

  function handleSort(nextSortKey: SortKey) {
    if (nextSortKey === sortKey) {
      setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection(getDefaultSortDirection(nextSortKey));
  }

  return (
    <Box className="match-box-score-card">
      <Title className="match-box-score-title" order={2}>
        <span
          aria-hidden="true"
          className="match-box-score-title-bar"
          style={{ backgroundColor: teamColor }}
        />
        <span>{title}</span>
      </Title>
      <Box className="match-box-score-scroll">
        <Table className="match-box-score-table" highlightOnHover>
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
                      className="match-box-score-sort-button"
                      onClick={() => handleSort(column.key)}
                      type="button"
                    >
                      <span>{column.label}</span>
                      <span aria-hidden="true" className="match-box-score-sort-indicator">
                        {isActiveSort ? sortIndicator : ""}
                      </span>
                    </button>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayRows.map((row) => (
              <Table.Tr
                className={
                  row.rowType === "total"
                    ? "match-box-score-total-row"
                    : row.rowType === "other"
                      ? "match-box-score-other-row"
                      : undefined
                }
                key={row.id}
              >
                {columns.map((column) => (
                  <Table.Td className={column.className} key={column.key}>
                    <Text className="match-box-score-value">{column.render(row)}</Text>
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
