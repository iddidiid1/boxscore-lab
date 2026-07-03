import { Box, Table, Text, Title } from "@mantine/core";
import type { MatchOtherStats, MatchPlayerStat } from "../../../features/matches";

type Props = { otherStats: MatchOtherStats; players: MatchPlayerStat[]; teamColor: string | null; title: string };
const percent = (value: number | null) => value === null ? "—" : `${value.toFixed(1)}%`;

export function MatchBoxScoreTable({ otherStats, players, teamColor, title }: Props) {
  return (
    <Box className="match-box-score-card app-panel">
      <Title className="match-box-score-title" order={2}><span aria-hidden="true" className="match-box-score-title-bar" style={{ backgroundColor: teamColor ?? undefined }} /><span>{title}</span></Title>
      <Box className="match-box-score-scroll app-table-wrap">
        <Table className="match-box-score-table app-data-table" highlightOnHover>
          <Table.Thead><Table.Tr>{["POS","Player","PTS","REB","AST","FGM","FGA","FG%","3PM","3PA","3P%","MIN","RATING"].map((label) => <Table.Th key={label}>{label}</Table.Th>)}</Table.Tr></Table.Thead>
          <Table.Tbody>
            {players.map((player) => <Table.Tr key={player.playerId}>
              <Table.Td>{player.position}</Table.Td><Table.Td>{player.playerName}{!player.isActive ? " (Inactive)" : ""}</Table.Td><Table.Td>{player.points}</Table.Td><Table.Td>{player.rebounds}</Table.Td><Table.Td>{player.assists}</Table.Td><Table.Td>{player.fieldGoalsMade}</Table.Td><Table.Td>{player.fieldGoalsAttempted}</Table.Td><Table.Td>{percent(player.fieldGoalPercentage)}</Table.Td><Table.Td>{player.threePointersMade}</Table.Td><Table.Td>{player.threePointersAttempted}</Table.Td><Table.Td>{percent(player.threePointPercentage)}</Table.Td><Table.Td>{player.minutes}</Table.Td><Table.Td>{player.rating.toFixed(1)}</Table.Td>
            </Table.Tr>)}
            <Table.Tr className="match-box-score-other-row"><Table.Td>—</Table.Td><Table.Td>Other</Table.Td><Table.Td>{otherStats.points}</Table.Td><Table.Td>{otherStats.rebounds}</Table.Td><Table.Td>{otherStats.assists}</Table.Td><Table.Td>{otherStats.fieldGoalsMade}</Table.Td><Table.Td>{otherStats.fieldGoalsAttempted}</Table.Td><Table.Td>{percent(otherStats.fieldGoalPercentage)}</Table.Td><Table.Td>{otherStats.threePointersMade}</Table.Td><Table.Td>{otherStats.threePointersAttempted}</Table.Td><Table.Td>{percent(otherStats.threePointPercentage)}</Table.Td><Table.Td>—</Table.Td><Table.Td>—</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
