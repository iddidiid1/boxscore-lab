import { Box, Group, Table, Text, Title } from "@mantine/core";
import { Trophy } from "lucide-react";
import type { EventResultTag, EventTeamResult } from "../types";

type EventResultsTableProps = {
  resultTags: EventResultTag[];
  results: EventTeamResult[];
};

export function EventResultsTable({ resultTags, results }: EventResultsTableProps) {
  const tagsById = new Map(resultTags.map((tag) => [tag.id, tag]));
  const sortedResults = [...results].sort((firstResult, secondResult) => {
    const firstPoints = tagsById.get(firstResult.resultTagId)?.rankingPoints ?? 0;
    const secondPoints = tagsById.get(secondResult.resultTagId)?.rankingPoints ?? 0;

    return secondPoints - firstPoints;
  });

  return (
    <Box className="event-detail-panel event-results-panel app-panel">
      <Title className="event-panel-title" order={2}>Final team results</Title>

      <Box className="event-results-table-wrap app-table-wrap">
        <Table className="event-results-table app-data-table" verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="event-result-rank-heading">Rank</Table.Th>
              <Table.Th>Team</Table.Th>
              <Table.Th>Event Points</Table.Th>
              <Table.Th>Result Tag</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedResults.map((result, index) => {
              const tag = tagsById.get(result.resultTagId);
              const isWinner = Boolean(tag?.isWinnerTag);
              const eventPoints = tag?.rankingPoints ?? 0;

              return (
                <Table.Tr data-winner={isWinner || undefined} key={result.teamId}>
                  <Table.Td className="event-result-rank">{index + 1}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      {isWinner ? <Trophy className="event-result-trophy" size={16} /> : null}
                      <Text className="event-result-team">{result.teamName}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td className="event-result-score">{eventPoints.toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Text className="event-result-tag" data-winner={isWinner || undefined}>
                      {tag?.label ?? "Unassigned"}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
