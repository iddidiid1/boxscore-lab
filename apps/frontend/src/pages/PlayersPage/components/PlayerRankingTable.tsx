import { Box, Table, Text, Title } from "@mantine/core";
import type { PlayerRanking, PlayerRankingSortDirection, PlayerRankingSortField } from "../types";

type PlayerRankingTableProps = {
  onSort: (field: PlayerRankingSortField) => void;
  players: PlayerRanking[];
  sortDirection: PlayerRankingSortDirection;
  sortField: PlayerRankingSortField;
};

type RankingColumn = {
  className?: string;
  key: keyof PlayerRanking;
  label: string;
  render: (player: PlayerRanking) => React.ReactNode;
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
    render: (player) => (
      <Box className="player-name-cell">
        <span
          aria-hidden="true"
          className="player-team-color-bar"
          style={{ backgroundColor: player.teamColor }}
        />
        <Text className="player-name-value">{player.name}</Text>
      </Box>
    )
  },
  { key: "team", label: "Team", render: (player) => player.team },
  { key: "position", label: "Position", render: (player) => player.position },
  {
    key: "points",
    label: "Points",
    render: (player) => player.points.toFixed(1),
    sortField: "points"
  },
  {
    key: "assists",
    label: "Assists",
    render: (player) => player.assists.toFixed(1),
    sortField: "assists"
  },
  {
    key: "rebounds",
    label: "Rebounds",
    render: (player) => player.rebounds.toFixed(1),
    sortField: "rebounds"
  },
  {
    key: "fieldGoalPercentage",
    label: "FG%",
    render: (player) => `${player.fieldGoalPercentage.toFixed(1)}%`,
    sortField: "fieldGoalPercentage"
  },
  {
    key: "threePointPercentage",
    label: "3PT%",
    render: (player) => `${player.threePointPercentage.toFixed(1)}%`,
    sortField: "threePointPercentage"
  },
  {
    key: "rating",
    label: "Rating",
    render: (player) => player.rating.toFixed(1),
    sortField: "rating"
  }
];

function getRankingValueClass(player: PlayerRanking, columnKey: keyof PlayerRanking) {
  const classNames = ["player-ranking-value"];

  if (columnKey === "rank" && player.rank <= 3) {
    classNames.push("player-ranking-value-podium", `player-ranking-value-rank-${player.rank}`);
  }

  return classNames.join(" ");
}

export function PlayerRankingTable({
  onSort,
  players,
  sortDirection,
  sortField
}: PlayerRankingTableProps) {
  return (
    <Box className="player-ranking-card">
      <Title order={2}>Player Rankings</Title>
      <Box className="player-ranking-table-scroll">
        <Table className="player-ranking-table">
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
                        className="player-sort-button"
                        onClick={() => onSort(column.sortField!)}
                        type="button"
                      >
                        <span>{column.label}</span>
                        <span aria-hidden="true" className="player-sort-indicator">
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
            {players.map((player) => (
              <Table.Tr key={player.id}>
                {columns.map((column) => (
                  <Table.Td className={column.className} key={column.key}>
                    {column.key === "name" ? (
                      column.render(player)
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
    </Box>
  );
}
