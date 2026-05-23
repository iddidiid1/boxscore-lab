import { Box } from "@mantine/core";
import type { MatchRecord } from "../../types";
import { MatchRecordCard } from "./MatchRecordCard";

type MatchHistoryListProps = {
  matches: MatchRecord[];
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
