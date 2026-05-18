import { Anchor, Box, Select, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { TurnPageControls } from "../PlayersPage/components";
import {
  mockEventOptions,
  mockPlayerEventStats,
  mockPlayerRankings
} from "../PlayersPage/mockPlayers";
import type { PlayerRanking, PlayerRankingEventId } from "../PlayersPage/types";
import {
  PlayerMatchHistory,
  PlayerPerformanceBars,
  PlayerProfileHeader,
  PlayerStatSummary,
  type PlayerMatchRecord,
  type PlayerPerformanceDimension,
  type PlayerSummaryStat
} from "./components";
import "./PlayerDetailPage.css";

const matchesPerPage = 10;

const mockPerformanceDimensions: PlayerPerformanceDimension[] = [
  { label: "Points", value: 86 },
  { label: "Rebounds", value: 68 },
  { label: "Assists", value: 74 }
];

const mockMatchHistory: PlayerMatchRecord[] = [
  {
    id: "match-01",
    event: "City Classic",
    eventId: "city-classic",
    match: "vs Harbor Kings",
    date: "2026-05-14",
    points: 28,
    rebounds: 5,
    assists: 8,
    fieldGoalPercentage: 52.4,
    threePointPercentage: 41.7,
    rating: 9.2
  },
  {
    id: "match-02",
    event: "Regional Finals",
    eventId: "regional-finals",
    match: "vs Capital Guard",
    date: "2026-05-07",
    points: 24,
    rebounds: 4,
    assists: 10,
    fieldGoalPercentage: 48.6,
    threePointPercentage: 38.5,
    rating: 8.8
  },
  {
    id: "match-03",
    event: "City Classic",
    eventId: "city-classic",
    match: "vs Coastal Wolves",
    date: "2026-04-30",
    points: 31,
    rebounds: 6,
    assists: 7,
    fieldGoalPercentage: 55.1,
    threePointPercentage: 44.0,
    rating: 9.6
  },
  {
    id: "match-04",
    event: "Regional Finals",
    eventId: "regional-finals",
    match: "vs Northside Crew",
    date: "2026-04-23",
    points: 22,
    rebounds: 3,
    assists: 9,
    fieldGoalPercentage: 46.9,
    threePointPercentage: 36.4,
    rating: 8.1
  },
  {
    id: "match-05",
    event: "City Classic",
    eventId: "city-classic",
    match: "vs Redwood Town",
    date: "2026-04-16",
    points: 27,
    rebounds: 5,
    assists: 6,
    fieldGoalPercentage: 50.0,
    threePointPercentage: 40.9,
    rating: 8.7
  },
  {
    id: "match-06",
    event: "Regional Finals",
    eventId: "regional-finals",
    match: "vs Ironbridge FC",
    date: "2026-04-09",
    points: 19,
    rebounds: 4,
    assists: 11,
    fieldGoalPercentage: 43.8,
    threePointPercentage: 35.3,
    rating: 7.9
  },
  {
    id: "match-07",
    event: "City Classic",
    eventId: "city-classic",
    match: "vs Prairie FC",
    date: "2026-04-02",
    points: 30,
    rebounds: 7,
    assists: 8,
    fieldGoalPercentage: 54.2,
    threePointPercentage: 42.9,
    rating: 9.4
  }
];

function getPlayerIdFromPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
}

function getSummaryStats(player: PlayerRanking): PlayerSummaryStat[] {
  return [
    { label: "PTS", value: player.points.toFixed(1) },
    { label: "REB", value: player.rebounds.toFixed(1) },
    { label: "AST", value: player.assists.toFixed(1) },
    { label: "FG%", value: `${player.fieldGoalPercentage.toFixed(1)}%` },
    { label: "3PT%", value: `${player.threePointPercentage.toFixed(1)}%` },
    { label: "RATING", value: player.rating.toFixed(1) }
  ];
}

export function PlayerDetailPage() {
  const [activeMatchPage, setActiveMatchPage] = useState(1);
  const [eventValue, setEventValue] = useState<PlayerRankingEventId>("season-total");
  const playerId = getPlayerIdFromPath();
  const player = mockPlayerRankings.find((item) => item.id === playerId);
  const eventScopedPlayer = useMemo(() => {
    if (!player) {
      return undefined;
    }

    return {
      ...player,
      ...(mockPlayerEventStats[eventValue][player.id] ?? {})
    };
  }, [eventValue, player]);
  const filteredMatches = useMemo(() => {
    if (eventValue === "season-total") {
      return mockMatchHistory;
    }

    return mockMatchHistory.filter((match) => match.eventId === eventValue);
  }, [eventValue]);
  const visibleMatches = useMemo(() => {
    const startIndex = (activeMatchPage - 1) * matchesPerPage;

    return filteredMatches.slice(startIndex, startIndex + matchesPerPage);
  }, [activeMatchPage, filteredMatches]);

  useEffect(() => {
    setActiveMatchPage(1);
  }, [eventValue]);

  if (!player) {
    return (
      <Stack className="player-detail-page" gap="md">
        <Anchor className="player-detail-back-link" href="/players">
          {"\u2190 Back to Players"}
        </Anchor>
        <Box className="player-detail-empty-state">
          <Text className="data-label">Player profile</Text>
          <Text className="player-detail-empty-title">Player not found</Text>
          <Text className="page-summary">
            This mock profile does not exist in the current local player dataset.
          </Text>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack className="player-detail-page" gap="md">
      <Anchor className="player-detail-back-link" href="/players">
        {"\u2190 Back to Players"}
      </Anchor>

      <Box className="player-detail-hero">
        <PlayerProfileHeader
          name={player.name}
          position={player.position}
          team={player.team}
          teamColor={player.teamColor}
        />
        <PlayerPerformanceBars dimensions={mockPerformanceDimensions} />
      </Box>

      <Box className="player-detail-event-filter">
        <Select
          allowDeselect={false}
          aria-label="Event filter"
          classNames={{ input: "player-detail-filter-input", label: "player-detail-filter-label" }}
          data={mockEventOptions}
          label="Event"
          onChange={(value) => {
            if (value) {
              setEventValue(value as PlayerRankingEventId);
            }
          }}
          value={eventValue}
        />
      </Box>

      <PlayerStatSummary stats={getSummaryStats(eventScopedPlayer ?? player)} />

      <Box className="player-match-history-section">
        <PlayerMatchHistory matches={visibleMatches} />
        <TurnPageControls
          activePage={activeMatchPage}
          onPageChange={setActiveMatchPage}
          pageSize={matchesPerPage}
          totalItems={filteredMatches.length}
        />
      </Box>
    </Stack>
  );
}
