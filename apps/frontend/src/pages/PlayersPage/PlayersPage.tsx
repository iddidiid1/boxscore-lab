import { Alert, Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { fetchPlayers, type PlayerListParams, type PlayerListResponse, type PlayerPosition } from "../../features/players";
import { DataPagination } from "../../shared/components/data-display";
import { LoadingState } from "../../shared/components/LoadingState";
import { PlayerRankingFilters, PlayerRankingTable, StatisticLeaderCards } from "./components";
import type { PlayerRankingSortField } from "./types";
import "./PlayersPage.css";

const pageSize = 10;
const positions = ["PG", "SG", "G", "SF", "PF", "F", "C"];
function readQuery(): PlayerListParams { const q = new URLSearchParams(location.search); const positive = (key: string) => /^\d+$/.test(q.get(key) ?? "") ? Number(q.get(key)) : undefined; const sortBy = q.get("sortBy"); const direction = q.get("sortDirection"); return { page: positive("page") ?? 1, pageSize, eventId: positive("eventId"), teamId: positive("teamId"), position: positions.includes(q.get("position") ?? "") ? q.get("position") as PlayerPosition : undefined, sortBy: (["points", "rebounds", "assists", "fieldGoalPercentage", "threePointPercentage", "rating"].includes(sortBy ?? "") ? sortBy : "points") as PlayerRankingSortField, sortDirection: direction === "asc" ? "asc" : "desc" }; }
function writeQuery(params: PlayerListParams, replace = false) { const q = new URLSearchParams(); if (params.eventId) q.set("eventId", String(params.eventId)); if (params.teamId) q.set("teamId", String(params.teamId)); if (params.position) q.set("position", params.position); if (params.sortBy !== "points" || params.sortDirection !== "desc") { q.set("sortBy", params.sortBy); q.set("sortDirection", params.sortDirection); } if (params.page !== 1) q.set("page", String(params.page)); const url = `${location.pathname}${q.size ? `?${q}` : ""}`; history[replace ? "replaceState" : "pushState"]({}, "", url); }

export function PlayersPage() {
  const [query, setQuery] = useState(readQuery);
  const [data, setData] = useState<PlayerListResponse>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);
  useEffect(() => { const pop = () => setQuery(readQuery()); addEventListener("popstate", pop); return () => removeEventListener("popstate", pop); }, []);
  useEffect(() => { const controller = new AbortController(); const id = ++requestId.current; setLoading(true); setError(undefined); fetchPlayers(query, controller.signal).then((response) => { if (id !== requestId.current) return; setData(response); if (response.pagination.page !== query.page) { const next = { ...query, page: response.pagination.page }; writeQuery(next, true); setQuery(next); } }).catch((reason) => { if (id === requestId.current && reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load players."); }).finally(() => { if (id === requestId.current) setLoading(false); }); return () => controller.abort(); }, [query]);
  const update = (change: Partial<PlayerListParams>, replace = false) => { const next = { ...query, ...change }; writeQuery(next, replace); setQuery(next); };
  const eventValue = query.eventId ? String(query.eventId) : "overall", teamValue = query.teamId ? String(query.teamId) : "all", positionValue = query.position ?? "all";
  const leaders = (data?.leaders ?? []).map((leader) => ({ id: leader.stat, accent: leader.stat, label: leader.label, value: leader.value.toFixed(1), playerName: leader.player?.name ?? "No eligible players", teamName: leader.team?.name ?? "" }));
  if (!data && loading) return <LoadingState label="Loading player statistics…" />;
  if (!data && error) return <Alert title="Unable to load players"><Text>{error}</Text><Button className="app-action-button app-action-button--context" mt="sm" onClick={() => setQuery({ ...query })} variant="outline">Retry</Button></Alert>;
  return <Stack className="players-page" gap="xl">
    <Group align="flex-start" className="players-header" justify="space-between"><Box><Text className="eyebrow">Performance source</Text><Title className="page-title" order={1}>Players</Title><Text className="page-summary" maw={600} mt="xs">Dynamic player rankings from eligible match records.</Text></Box></Group>
    {error && <Alert title="Refresh failed">{error}</Alert>}
    <Box className="players-board" aria-busy={loading}>
      <PlayerRankingFilters eventOptions={[{ label: "Overall", value: "overall" }, ...(data?.filterOptions.events ?? []).map((item) => ({ label: item.name, value: String(item.id) }))]} eventValue={eventValue} onEventChange={(value) => update({ eventId: value === "overall" ? undefined : Number(value), teamId: undefined, position: undefined, page: 1 })} teamOptions={[{ label: "All teams", value: "all" }, ...(data?.filterOptions.teams ?? []).map((item) => ({ label: item.name, value: String(item.id) }))] as never} teamValue={teamValue} onTeamChange={(value) => update({ teamId: value === "all" ? undefined : Number(value), position: undefined, page: 1 })} positionOptions={["all", ...(data?.filterOptions.positions ?? [])]} positionValue={positionValue} onPositionChange={(value) => update({ position: value === "all" ? undefined : value as PlayerPosition, page: 1 })} />
      <StatisticLeaderCards leaders={leaders} />
      {data && <PlayerRankingTable pagination={<DataPagination activePage={data.pagination.page} pageSize={pageSize} totalItems={data.pagination.totalItems} onPageChange={(page) => update({ page })} />} players={data.items} sortField={query.sortBy} sortDirection={query.sortDirection} onSort={(field) => update({ sortBy: field, sortDirection: field === query.sortBy && query.sortDirection === "desc" ? "asc" : "desc", page: 1 })} onPlayerSelect={(slug) => { history.pushState({}, "", `/players/${slug}`); dispatchEvent(new PopStateEvent("popstate")); }} />}
    </Box>
  </Stack>;
}
