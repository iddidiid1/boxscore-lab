import { Box, Skeleton } from "@mantine/core";
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

export function MatchHistoryListSkeleton() {
  return (
    <Box aria-label="Loading matches" className="match-history-list">
      {Array.from({ length: 4 }, (_, index) => (
        <Box className="match-card match-card--skeleton" key={index}>
          <Box className="match-skeleton-meta">
            <Skeleton height={10} width="38%" />
            <Skeleton height={10} width="28%" />
          </Box>
          <Box className="match-skeleton-scoreline">
            <Skeleton height={46} width="34%" />
            <Skeleton height={34} width={88} />
            <Skeleton height={46} width="34%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
