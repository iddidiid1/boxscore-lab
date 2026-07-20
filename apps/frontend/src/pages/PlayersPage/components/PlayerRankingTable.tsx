import { Box, Table, Text, Title } from "@mantine/core";
import type { PlayerRanking, PlayerRankingSortDirection, PlayerRankingSortField } from "../types";

type PlayerRankingTableProps = {
  onPlayerSelect?: (playerId: string) => void;
  onSort: (field: PlayerRankingSortField) => void;
  pagination?: React.ReactNode;
  players: PlayerRanking[];
  sortDirection: PlayerRankingSortDirection;
  sortField: PlayerRankingSortField;
};

type RankingColumn = {
  className?: string;
  key: string;
  label: string;
  render: (
    player: PlayerRanking,
    onPlayerSelect?: (playerId: string) => void
  ) => React.ReactNode;
  sortField?: PlayerRankingSortField;
};

const columns: RankingColumn[] = [
  {
    key: "rank",
    label: "Rank",
    className: "player-rank-column",
    render: (player) => player.rank
  },
  {
    key: "name",
    label: "Name",
    className: "player-name-column",
    render: (player, onPlayerSelect) => (
      <Box className="player-name-cell">
        <span
          aria-hidden="true"
          className="player-team-color-bar"
        style={{ backgroundColor: player.team.primaryColor ?? "transparent" }}
        />
        {onPlayerSelect ? (
          <button
            className="player-name-button"
            onClick={() => onPlayerSelect(player.slug)}
            type="button"
          >
            {player.name}
          </button>
        ) : (
          <Text className="player-name-value">{player.name}</Text>
        )}
      </Box>
    )
  },
  { key: "team", label: "Team", render: (player) => player.team.name },
  { key: "position", label: "Position", render: (player) => player.position },
  {
    key: "points",
    label: "Points",
    render: (player) => player.stats.points.toFixed(1),
    sortField: "points"
  },
  {
    key: "assists",
    label: "Assists",
    render: (player) => player.stats.assists.toFixed(1),
    sortField: "assists"
  },
  {
    key: "rebounds",
    label: "Rebounds",
    render: (player) => player.stats.rebounds.toFixed(1),
    sortField: "rebounds"
  },
  {
    key: "fieldGoalPercentage",
    label: "FG%",
    render: (player) => player.stats.fieldGoalPercentage === null ? "—" : `${player.stats.fieldGoalPercentage.toFixed(1)}%`,
    sortField: "fieldGoalPercentage"
  },
  {
    key: "threePointPercentage",
    label: "3PT%",
    render: (player) => player.stats.threePointPercentage === null ? "—" : `${player.stats.threePointPercentage.toFixed(1)}%`,
    sortField: "threePointPercentage"
  },
  {
    key: "rating",
    label: "Rating",
    render: (player) => player.stats.rating.toFixed(1),
    sortField: "rating"
  }
];

function getRankingValueClass(player: PlayerRanking, columnKey: string) {
  const classNames = ["player-ranking-value"];

  if (columnKey === "rank" && player.rank <= 3) {
    classNames.push("player-ranking-value-podium", `player-ranking-value-rank-${player.rank}`);
  }

  return classNames.join(" ");
}

export function PlayerRankingTable({
  onPlayerSelect,
  onSort,
  pagination,
  players,
  sortDirection,
  sortField
}: PlayerRankingTableProps) {
  return (
    <Box className="player-ranking-card app-data-bay">
      <Title order={2}>Player Rankings</Title>
      <Box className="player-ranking-table-scroll app-table-wrap">
        <Table className="player-ranking-table app-data-table">
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => {
                const isActiveSort = column.sortField === sortField;
                const sortIndicator = sortDirection === "asc" ? "\u2191" : "\u2193";

                return (
                  <Table.Th
                    aria-sort={
                      isActiveSort
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : column.sortField
                          ? "none"
                          : undefined
                    }
                    className={column.className}
                    key={column.key}
                  >
                    {column.sortField ? (
                      <button
                        className="player-sort-button app-sort-control"
                        onClick={() => onSort(column.sortField!)}
                        type="button"
                      >
                        <span>{column.label}</span>
                        <span aria-hidden="true" className="player-sort-indicator app-sort-control__indicator">
                          {isActiveSort ? sortIndicator : ""}
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {players.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text className="page-summary">
                    No eligible players match these filters.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : players.map((player) => (
              <Table.Tr key={player.id}>
                {columns.map((column) => (
                  <Table.Td className={column.className} key={column.key}>
                    {column.key === "name" ? (
                      column.render(player, onPlayerSelect)
                    ) : (
                      <Text className={getRankingValueClass(player, column.key)}>
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
      {pagination}
    </Box>
  );
}
