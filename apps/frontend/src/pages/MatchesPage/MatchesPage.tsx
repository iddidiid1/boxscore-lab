import { Alert, Button, Center, Loader, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchMatches, type MatchFilterOptions, type MatchListItem } from "../../features/matches";
import { TurnPageControls } from "../PlayersPage/components";
import { MatchFilters, MatchHistoryList, MatchesPageHeader } from "./components/matches";
import "./MatchesPage.css";

const matchesPerPage = 10;

export function MatchesPage() {
  const [page, setPage] = useState(1);
  const [eventId, setEventId] = useState<number>();
  const [teamId, setTeamId] = useState<number>();
  const [stageTagId, setStageTagId] = useState<number>();
  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [options, setOptions] = useState<MatchFilterOptions>({ events: [], teams: [], stageTags: [] });
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);
    fetchMatches({ page, pageSize: matchesPerPage, eventId, teamId, stageTagId }, controller.signal)
      .then((response) => {
        setMatches(response.items);
        setOptions(response.filterOptions);
        setTotalItems(response.pagination.totalItems);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Unable to load matches.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [eventId, page, reloadKey, stageTagId, teamId]);

  function changeEvent(next?: number) {
    setEventId(next);
    setTeamId(undefined);
    setStageTagId(undefined);
    setPage(1);
  }

  return (
    <Stack className="matches-page" gap="xl">
      <MatchesPageHeader />
      <Stack className="matches-board" gap="md">
        <MatchFilters
          eventId={eventId}
          events={options.events}
          onEventChange={changeEvent}
          onStageTagChange={(value) => { setStageTagId(value); setPage(1); }}
          onTeamChange={(value) => { setTeamId(value); setPage(1); }}
          stageTagId={stageTagId}
          stageTags={options.stageTags}
          teamId={teamId}
          teams={options.teams}
        />
        {loading ? <Center py="xl"><Loader aria-label="Loading matches" /></Center> : null}
        {error ? <Alert color="red" title="Unable to load matches">{error}<Button ml="md" onClick={() => setReloadKey((value) => value + 1)} size="xs">Retry</Button></Alert> : null}
        {!loading && !error && matches.length === 0 ? <Alert title="No matches found"><Text mb="sm">There are no matches for the selected filters.</Text><Button onClick={() => { changeEvent(undefined); setTeamId(undefined); }} size="xs">Clear filters</Button></Alert> : null}
        {!loading && !error ? <MatchHistoryList matches={matches} /> : null}
        {!loading && !error && totalItems > 0 ? <TurnPageControls activePage={page} onPageChange={setPage} pageSize={matchesPerPage} totalItems={totalItems} /> : null}
      </Stack>
    </Stack>
  );
}
