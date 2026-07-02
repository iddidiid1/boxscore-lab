import { Box } from "@mantine/core";
import type { MatchListItem } from "../../../../features/matches";
import { MatchRecordCard } from "./MatchRecordCard";

type MatchHistoryListProps = {
  matches: MatchListItem[];
};

export function MatchHistoryList({ matches }: MatchHistoryListProps) {
  return (
    <Box className="match-history-list">
      {matches.map((match) => (
        <MatchRecordCard key={match.id} match={match} />
      ))}
    </Box>
  );
}
