import { Box, Table, Text, Title } from "@mantine/core";

export type PlayerMatchRecord = {
  id: string;
  event: string;
  eventId: string;
  match: string;
  date: string;
  points: number;
  rebounds: number;
  assists: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  rating: number;
};

type PlayerMatchHistoryProps = {
  matches: PlayerMatchRecord[];
};

const columns: Array<{
  key: keyof PlayerMatchRecord;
  label: string;
  render: (match: PlayerMatchRecord) => string;
}> = [
  { key: "match", label: "Match / Opponent", render: (match) => match.match },
  { key: "date", label: "Date", render: (match) => match.date },
  { key: "event", label: "Event", render: (match) => match.event },
  { key: "points", label: "Points", render: (match) => match.points.toFixed(1) },
  { key: "rebounds", label: "Rebounds", render: (match) => match.rebounds.toFixed(1) },
  { key: "assists", label: "Assists", render: (match) => match.assists.toFixed(1) },
  {
    key: "fieldGoalPercentage",
    label: "FG%",
    render: (match) => `${match.fieldGoalPercentage.toFixed(1)}%`
  },
  {
    key: "threePointPercentage",
    label: "3PT%",
    render: (match) => `${match.threePointPercentage.toFixed(1)}%`
  },
  { key: "rating", label: "Rating", render: (match) => match.rating.toFixed(1) }
];

export function PlayerMatchHistory({ matches }: PlayerMatchHistoryProps) {
  return (
    <Box className="player-match-card">
      <Title order={2}>Match History</Title>
      <Box className="player-match-table-scroll">
        <Table className="player-match-table">
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key}>{column.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {matches.map((match) => (
              <Table.Tr key={match.id}>
                {columns.map((column) => (
                  <Table.Td key={column.key}>
                    <Text className="player-match-value">{column.render(match)}</Text>
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
