import { Stack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { TurnPageControls } from "../PlayersPage/components";
import {
  MatchFilters,
  MatchHistoryList,
  MatchesPageHeader
} from "./components/matches";
import type { MatchRecord } from "./types";
import "./MatchesPage.css";

const matchesPerPage = 10;
const allTeamsValue = "All Teams";
const allEventsValue = "All Events";
const allTagsValue = "All Tags";

const mockMatches: MatchRecord[] = [
  {
    id: "match-012",
    eventName: "Winter Cup Finals",
    startsAt: "2026-05-17",
    tags: ["Knockout", "Final"],
    teamA: { id: "falcon-united", name: "Falcon United", color: "#3b82f6" },
    teamAScore: 87,
    teamB: { id: "harbor-kings", name: "Harbor Kings", color: "#f97316" },
    teamBScore: 82
  },
  {
    id: "match-011",
    eventName: "Winter Cup Finals",
    startsAt: "2026-05-16",
    tags: ["Knockout", "Semi Final"],
    teamA: { id: "summit-athletic", name: "Summit Athletic", color: "#22c55e" },
    teamAScore: 76,
    teamB: { id: "capital-guard", name: "Capital Guard", color: "#eab308" },
    teamBScore: 91
  },
  {
    id: "match-010",
    eventName: "May Ladder Round",
    startsAt: "2026-05-12",
    tags: ["Group Stage"],
    teamA: { id: "metro-rangers", name: "Metro Rangers", color: "#06b6d4" },
    teamAScore: 68,
    teamB: { id: "coastal-wolves", name: "Coastal Wolves", color: "#a855f7" },
    teamBScore: 68
  },
  {
    id: "match-009",
    eventName: "May Ladder Round",
    startsAt: "2026-05-09",
    tags: ["Group Stage"],
    teamA: { id: "northside-crew", name: "Northside Crew", color: "#ef4444" },
    teamAScore: 84,
    teamB: { id: "redwood-town", name: "Redwood Town", color: "#14b8a6" },
    teamBScore: 79
  },
  {
    id: "match-008",
    eventName: "May Ladder Round",
    startsAt: "2026-05-05",
    tags: ["Group Stage"],
    teamA: { id: "valley-strikers", name: "Valley Strikers", color: "#f43f5e" },
    teamAScore: 72,
    teamB: { id: "prairie-fc", name: "Prairie FC", color: "#84cc16" },
    teamBScore: 77
  },
  {
    id: "match-007",
    eventName: "Autumn Invitational",
    startsAt: "2026-04-30",
    tags: ["Knockout", "Final"],
    teamA: { id: "cedar-city", name: "Cedar City", color: "#38bdf8" },
    teamAScore: 63,
    teamB: { id: "orchard-park", name: "Orchard Park", color: "#fb7185" },
    teamBScore: 70
  },
  {
    id: "match-006",
    eventName: "Autumn Invitational",
    startsAt: "2026-04-26",
    tags: ["Knockout"],
    teamA: { id: "ironbridge-fc", name: "Ironbridge FC", color: "#64748b" },
    teamAScore: 89,
    teamB: { id: "silverline", name: "Silverline", color: "#cbd5e1" },
    teamBScore: 86
  },
  {
    id: "match-005",
    eventName: "Autumn Invitational",
    startsAt: "2026-04-20",
    tags: ["Group Stage"],
    teamA: { id: "falcon-united", name: "Falcon United", color: "#3b82f6" },
    teamAScore: 74,
    teamB: { id: "summit-athletic", name: "Summit Athletic", color: "#22c55e" },
    teamBScore: 81
  },
  {
    id: "match-004",
    eventName: "Opening Showcase",
    startsAt: "2026-04-14",
    tags: ["Final"],
    teamA: { id: "harbor-kings", name: "Harbor Kings", color: "#f97316" },
    teamAScore: 95,
    teamB: { id: "capital-guard", name: "Capital Guard", color: "#eab308" },
    teamBScore: 90
  },
  {
    id: "match-003",
    eventName: "Opening Showcase",
    startsAt: "2026-04-10",
    tags: ["Group Stage"],
    teamA: { id: "metro-rangers", name: "Metro Rangers", color: "#06b6d4" },
    teamAScore: 80,
    teamB: { id: "northside-crew", name: "Northside Crew", color: "#ef4444" },
    teamBScore: 83
  },
  {
    id: "match-002",
    eventName: "Opening Showcase",
    startsAt: "2026-04-06",
    tags: ["Group Stage"],
    teamA: { id: "coastal-wolves", name: "Coastal Wolves", color: "#a855f7" },
    teamAScore: 78,
    teamB: { id: "redwood-town", name: "Redwood Town", color: "#14b8a6" },
    teamBScore: 73
  },
  {
    id: "match-001",
    eventName: "Opening Showcase",
    startsAt: "2026-04-02",
    tags: ["Group Stage"],
    teamA: { id: "valley-strikers", name: "Valley Strikers", color: "#f43f5e" },
    teamAScore: 66,
    teamB: { id: "prairie-fc", name: "Prairie FC", color: "#84cc16" },
    teamBScore: 69
  }
];

export function MatchesPage() {
  const [activePage, setActivePage] = useState(1);
  const [teamValue, setTeamValue] = useState(allTeamsValue);
  const [eventValue, setEventValue] = useState(allEventsValue);
  const [tagValue, setTagValue] = useState(allTagsValue);

  const teamOptions = useMemo(() => {
    const teams = new Map<string, string>();

    mockMatches.forEach((match) => {
      teams.set(match.teamA.id, match.teamA.name);
      teams.set(match.teamB.id, match.teamB.name);
    });

    return [allTeamsValue, ...[...teams.values()].sort()];
  }, []);

  const eventOptions = useMemo(() => {
    const events = [...new Set(mockMatches.map((match) => match.eventName))].sort();

    return [allEventsValue, ...events];
  }, []);

  const tagOptions = useMemo(() => {
    if (eventValue === allEventsValue) {
      return [allTagsValue];
    }

    const tags = [
      ...new Set(
        mockMatches
          .filter((match) => match.eventName === eventValue)
          .flatMap((match) => match.tags)
      )
    ].sort();

    return [allTagsValue, ...tags];
  }, [eventValue]);

  const filteredMatches = useMemo(() => {
    return [...mockMatches]
      .filter(
        (match) =>
          teamValue === allTeamsValue ||
          match.teamA.name === teamValue ||
          match.teamB.name === teamValue
      )
      .filter((match) => eventValue === allEventsValue || match.eventName === eventValue)
      .filter((match) => tagValue === allTagsValue || match.tags.includes(tagValue))
      .sort(
        (firstMatch, secondMatch) =>
          new Date(secondMatch.startsAt).getTime() - new Date(firstMatch.startsAt).getTime()
      );
  }, [eventValue, tagValue, teamValue]);

  const visibleMatches = useMemo(() => {
    const startIndex = (activePage - 1) * matchesPerPage;

    return filteredMatches.slice(startIndex, startIndex + matchesPerPage);
  }, [activePage, filteredMatches]);

  useEffect(() => {
    setActivePage(1);
  }, [eventValue, tagValue, teamValue]);

  useEffect(() => {
    if (eventValue === allEventsValue || !tagOptions.includes(tagValue)) {
      setTagValue(allTagsValue);
    }
  }, [eventValue, tagOptions, tagValue]);

  return (
    <Stack className="matches-page" gap="xl">
      <MatchesPageHeader />

      <Stack className="matches-board" gap="md">
        <MatchFilters
          allEventsValue={allEventsValue}
          allTagsValue={allTagsValue}
          allTeamsValue={allTeamsValue}
          eventOptions={eventOptions}
          eventValue={eventValue}
          isTagFilterDisabled={eventValue === allEventsValue}
          onEventChange={setEventValue}
          onTagChange={setTagValue}
          onTeamChange={setTeamValue}
          tagOptions={tagOptions}
          tagValue={tagValue}
          teamOptions={teamOptions}
          teamValue={teamValue}
        />

        <MatchHistoryList matches={visibleMatches} />

        <TurnPageControls
          activePage={activePage}
          onPageChange={setActivePage}
          pageSize={matchesPerPage}
          totalItems={filteredMatches.length}
        />
      </Stack>
    </Stack>
  );
}
