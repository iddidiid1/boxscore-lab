import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
  PlayerRankingFilters,
  PlayerRankingTable,
  StatisticLeaderCards,
  TurnPageControls
} from "./components";
import {
  mockEventOptions,
  mockPlayerEventStats,
  mockPlayerRankings
} from "./mockPlayers";
import type {
  PlayerRanking,
  PlayerRankingEventId,
  PlayerRankingSortDirection,
  PlayerRankingSortField,
  StatisticLeader,
  StatisticLeaderAccent
} from "./types";
import "./PlayersPage.css";

const playersPerPage = 10;
const allTeamsValue = "All teams";
const allPositionsValue = "All positions";

function comparePlayersByStat(
  firstPlayer: PlayerRanking,
  secondPlayer: PlayerRanking,
  sortField: PlayerRankingSortField,
  sortDirection: PlayerRankingSortDirection
) {
  const comparison = firstPlayer[sortField] - secondPlayer[sortField];

  return sortDirection === "asc" ? comparison : -comparison;
}

function createStatisticLeader(
  players: PlayerRanking[],
  field: PlayerRankingSortField,
  label: string,
  accent: StatisticLeaderAccent,
  valueSuffix = ""
): StatisticLeader {
  const leader = players.reduce((currentLeader, player) =>
    player[field] > currentLeader[field] ? player : currentLeader
  );

  return {
    id: field,
    accent,
    label,
    value: `${leader[field].toFixed(1)}${valueSuffix}`,
    playerName: leader.name,
    teamName: leader.team
  };
}

export function PlayersPage() {
  const [activePage, setActivePage] = useState(1);
  const [eventValue, setEventValue] = useState<PlayerRankingEventId>("season-total");
  const [teamValue, setTeamValue] = useState(allTeamsValue);
  const [positionValue, setPositionValue] = useState(allPositionsValue);
  const [sortField, setSortField] = useState<PlayerRankingSortField>("points");
  const [sortDirection, setSortDirection] = useState<PlayerRankingSortDirection>("desc");

  const teamOptions = useMemo(() => {
    const teams = [...new Set(mockPlayerRankings.map((player) => player.team))].sort();

    return [allTeamsValue, ...teams];
  }, []);

  const positionOptions = useMemo(() => {
    const positions = [...new Set(mockPlayerRankings.map((player) => player.position))].sort();

    return [allPositionsValue, ...positions];
  }, []);

  const eventPlayers = useMemo(() => {
    const eventStats = mockPlayerEventStats[eventValue];

    return mockPlayerRankings.map((player) => ({
      ...player,
      ...(eventStats[player.id] ?? {})
    }));
  }, [eventValue]);

  const statisticLeaders = useMemo(
    () => [
      createStatisticLeader(eventPlayers, "points", "Points Per Game", "points"),
      createStatisticLeader(eventPlayers, "assists", "Assists Per Game", "assists"),
      createStatisticLeader(eventPlayers, "rebounds", "Rebounds Per Game", "rebounds"),
      createStatisticLeader(eventPlayers, "rating", "Player Rating", "rating")
    ],
    [eventPlayers]
  );

  const rankedPlayers = useMemo(() => {
    return eventPlayers
      .filter((player) => teamValue === allTeamsValue || player.team === teamValue)
      .filter((player) => positionValue === allPositionsValue || player.position === positionValue)
      .sort((firstPlayer, secondPlayer) =>
        comparePlayersByStat(firstPlayer, secondPlayer, sortField, sortDirection)
      )
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }));
  }, [eventPlayers, positionValue, sortDirection, sortField, teamValue]);

  const visiblePlayers = useMemo(() => {
    const startIndex = (activePage - 1) * playersPerPage;

    return rankedPlayers.slice(startIndex, startIndex + playersPerPage);
  }, [activePage, rankedPlayers]);

  useEffect(() => {
    setActivePage(1);
  }, [eventValue, positionValue, sortDirection, sortField, teamValue]);

  function handleSort(nextSortField: PlayerRankingSortField) {
    if (nextSortField === sortField) {
      setSortDirection((currentDirection) => (currentDirection === "desc" ? "asc" : "desc"));
      return;
    }

    setSortField(nextSortField);
    setSortDirection("desc");
  }

  function handlePlayerSelect(playerId: string) {
    const nextPath = `/players/${playerId}`;

    window.history.pushState({}, "", nextPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <Stack className="players-page" gap="xl">
      <Group align="flex-start" className="players-header" justify="space-between">
        <Box>
          <Text className="eyebrow">Performance source</Text>
          <Title className="page-title" order={1}>
            Players
          </Title>
          <Text className="page-summary" maw={600} mt="xs">
            Track the league's leading players across scoring, playmaking, efficiency, and
            rebounding signals.
          </Text>
        </Box>
      </Group>

      <Box className="players-board">
        <PlayerRankingFilters
          eventOptions={mockEventOptions}
          eventValue={eventValue}
          onEventChange={setEventValue}
          onPositionChange={setPositionValue}
          onTeamChange={setTeamValue}
          positionOptions={positionOptions}
          positionValue={positionValue}
          teamOptions={teamOptions}
          teamValue={teamValue}
        />
        <StatisticLeaderCards leaders={statisticLeaders} />
        <PlayerRankingTable
          onPlayerSelect={handlePlayerSelect}
          onSort={handleSort}
          players={visiblePlayers}
          sortDirection={sortDirection}
          sortField={sortField}
        />
        <TurnPageControls
          activePage={activePage}
          onPageChange={setActivePage}
          pageSize={playersPerPage}
          totalItems={rankedPlayers.length}
        />
      </Box>
    </Stack>
  );
}
