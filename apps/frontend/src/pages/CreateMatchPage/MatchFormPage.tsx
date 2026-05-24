import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { MatchFormActions, MatchInfoForm, MatchStatsInputTable } from "./components";
import { mockMatchFormEvents, mockMatchFormTeams } from "./mockMatchForm";
import type { MatchFormTeam, PlayerStatInput, PlayerStatsById } from "./types";
import "./CreateMatchPage.css";

const EMPTY_TAGS: string[] = [];

export type MatchFormInitialValues = {
  eventId?: string | null;
  selectedTags?: string[];
  matchDate?: string;
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  homeStats?: PlayerStatsById;
  awayStats?: PlayerStatsById;
};

type MatchFormPageProps = {
  cancelHref?: string;
  description: string;
  initialValues?: MatchFormInitialValues;
  title: string;
};

function createEmptyStatInput(): PlayerStatInput {
  return {
    points: 0,
    rebounds: 0,
    assists: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0,
    minutes: 0,
    rating: 0
  };
}

function createEmptyPlayerStats(team: MatchFormTeam | undefined): PlayerStatsById {
  if (!team) {
    return {};
  }

  return Object.fromEntries(team.players.map((player) => [player.id, createEmptyStatInput()]));
}

export function MatchFormPage({
  cancelHref = "/matches",
  description,
  initialValues,
  title
}: MatchFormPageProps) {
  const [eventId, setEventId] = useState<string | null>(initialValues?.eventId ?? null);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialValues?.selectedTags ?? []);
  const [matchDate, setMatchDate] = useState(initialValues?.matchDate ?? "");
  const [homeTeamId, setHomeTeamId] = useState<string | null>(initialValues?.homeTeamId ?? null);
  const [awayTeamId, setAwayTeamId] = useState<string | null>(initialValues?.awayTeamId ?? null);
  const [homeStats, setHomeStats] = useState<PlayerStatsById>(initialValues?.homeStats ?? {});
  const [awayStats, setAwayStats] = useState<PlayerStatsById>(initialValues?.awayStats ?? {});

  const selectedEvent = useMemo(
    () => mockMatchFormEvents.find((event) => event.id === eventId),
    [eventId]
  );
  const tagOptions = useMemo(() => selectedEvent?.tags ?? EMPTY_TAGS, [selectedEvent]);
  const homeTeam = useMemo(
    () => mockMatchFormTeams.find((team) => team.id === homeTeamId),
    [homeTeamId]
  );
  const awayTeam = useMemo(
    () => mockMatchFormTeams.find((team) => team.id === awayTeamId),
    [awayTeamId]
  );
  const canSave = Boolean(eventId && matchDate && homeTeamId && awayTeamId);

  useEffect(() => {
    setSelectedTags((currentTags) => {
      const validTags = currentTags.filter((tag) => tagOptions.includes(tag));

      if (validTags.length === currentTags.length) {
        return currentTags;
      }

      return validTags;
    });
  }, [tagOptions]);

  function handleHomeTeamChange(nextHomeTeamId: string | null) {
    const nextHomeTeam = mockMatchFormTeams.find((team) => team.id === nextHomeTeamId);

    setHomeTeamId(nextHomeTeamId);
    setHomeStats(createEmptyPlayerStats(nextHomeTeam));

    if (nextHomeTeamId && nextHomeTeamId === awayTeamId) {
      setAwayTeamId(null);
      setAwayStats({});
    }
  }

  function handleAwayTeamChange(nextAwayTeamId: string | null) {
    const nextAwayTeam = mockMatchFormTeams.find((team) => team.id === nextAwayTeamId);

    setAwayTeamId(nextAwayTeamId);
    setAwayStats(createEmptyPlayerStats(nextAwayTeam));

    if (nextAwayTeamId && nextAwayTeamId === homeTeamId) {
      setHomeTeamId(null);
      setHomeStats({});
    }
  }

  function updatePlayerStats(
    side: "home" | "away",
    playerId: string,
    statKey: keyof PlayerStatInput,
    value: number
  ) {
    const setStats = side === "home" ? setHomeStats : setAwayStats;

    setStats((currentStats) => ({
      ...currentStats,
      [playerId]: {
        ...(currentStats[playerId] ?? createEmptyStatInput()),
        [statKey]: value
      }
    }));
  }

  return (
    <Stack className="create-match-page" gap="lg">
      <Group align="flex-start" className="create-match-header" justify="space-between">
        <Box>
          <Text className="eyebrow">Match workspace</Text>
          <Title className="page-title" order={1}>
            {title}
          </Title>
          <Text className="page-summary" maw={640} mt="xs">
            {description}
          </Text>
        </Box>

        <MatchFormActions canSave={canSave} cancelHref={cancelHref} />
      </Group>

      <MatchInfoForm
        awayTeamId={awayTeamId}
        eventId={eventId}
        eventOptions={mockMatchFormEvents}
        homeTeamId={homeTeamId}
        matchDate={matchDate}
        onAwayTeamChange={handleAwayTeamChange}
        onEventChange={setEventId}
        onHomeTeamChange={handleHomeTeamChange}
        onMatchDateChange={setMatchDate}
        onTagsChange={setSelectedTags}
        selectedTags={selectedTags}
        tagOptions={tagOptions}
        teams={mockMatchFormTeams}
      />

      {homeTeam ? (
        <MatchStatsInputTable
          onPlayerStatChange={(playerId, statKey, value) =>
            updatePlayerStats("home", playerId, statKey, value)
          }
          statsByPlayerId={homeStats}
          team={homeTeam}
        />
      ) : null}

      {awayTeam ? (
        <MatchStatsInputTable
          onPlayerStatChange={(playerId, statKey, value) =>
            updatePlayerStats("away", playerId, statKey, value)
          }
          statsByPlayerId={awayStats}
          team={awayTeam}
        />
      ) : null}
    </Stack>
  );
}
