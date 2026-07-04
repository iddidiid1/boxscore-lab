import { Alert, Anchor, Box, Button, Loader, Select, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { fetchPlayer, type PlayerDetailResponse } from "../../features/players";
import { ApiClientError } from "../../features/teams/api/teams";
import { TurnPageControls } from "../PlayersPage/components";
import { PlayerAwards, PlayerMatchHistory, PlayerPerformanceBars, PlayerProfileHeader, PlayerStatSummary } from "./components";
import "./PlayerDetailPage.css";
const pageSize = 10;
function slug() { return location.pathname.split("/").filter(Boolean)[1] ?? ""; }
function read() { const q = new URLSearchParams(location.search); return { eventId: /^\d+$/.test(q.get("eventId") ?? "") ? Number(q.get("eventId")) : undefined, page: /^\d+$/.test(q.get("page") ?? "") ? Number(q.get("page")) : 1 }; }
function write(state: { eventId?: number; page: number }, replace = false) { const q = new URLSearchParams(); if (state.eventId) q.set("eventId", String(state.eventId)); if (state.page !== 1) q.set("page", String(state.page)); history[replace ? "replaceState" : "pushState"]({}, "", `${location.pathname}${q.size ? `?${q}` : ""}`); }
const pct = (value: number | null) => value === null ? "—" : `${value.toFixed(1)}%`;
export function PlayerDetailPage() {
  const [query, setQuery] = useState(read); const [data, setData] = useState<PlayerDetailResponse>(); const [error, setError] = useState<string>(); const [notFound, setNotFound] = useState(false); const [loading, setLoading] = useState(true); const requestId = useRef(0);
  useEffect(() => { const pop = () => setQuery(read()); addEventListener("popstate", pop); return () => removeEventListener("popstate", pop); }, []);
  useEffect(() => { const controller = new AbortController(), id = ++requestId.current; setLoading(true); setError(undefined); fetchPlayer(slug(), { ...query, pageSize }, controller.signal).then((response) => { if (id !== requestId.current) return; setData(response); setNotFound(false); if (response.matches.pagination.page !== query.page) { const next = { ...query, page: response.matches.pagination.page }; write(next, true); setQuery(next); } }).catch((reason) => { if (id !== requestId.current || reason?.name === "AbortError") return; if (reason instanceof ApiClientError && reason.response.error === "PLAYER_NOT_FOUND") setNotFound(true); else setError(reason instanceof Error ? reason.message : "Unable to load player."); }).finally(() => { if (id === requestId.current) setLoading(false); }); return () => controller.abort(); }, [query]);
  const update = (next: typeof query) => { write(next); setQuery(next); };
  if (!data && loading) return <Stack align="center"><Loader /><Text>Loading player profile…</Text></Stack>;
  if (notFound) return <Alert title="Player not found">No player exists for this address.</Alert>;
  if (!data) return <Alert title="Unable to load player"><Text>{error}</Text><Button mt="sm" onClick={() => setQuery({ ...query })}>Retry</Button></Alert>;
  const stats = data.stats;
  return <Stack className="player-detail-page" gap="md" aria-busy={loading}>
    <Anchor className="player-detail-back-link" href="/players">← Back to Players</Anchor>
    {error && <Alert title="Refresh failed">{error}</Alert>}
    <Box className="player-detail-hero"><Box className="player-profile-card app-panel"><PlayerProfileHeader name={data.player.name} number={data.player.number} position={data.player.position} team={data.player.team.name} teamColor={data.player.team.primaryColor ?? "transparent"} isActive={data.player.isActive} teamArchived={data.player.team.archivedAt !== null} /><PlayerAwards awards={data.awards} /></Box><PlayerPerformanceBars dimensions={data.performanceBars} /></Box>
    <Box className="player-detail-event-filter app-panel"><Select allowDeselect={false} aria-label="Event filter" classNames={{ input: "player-detail-filter-input app-control-input", label: "player-detail-filter-label app-control-label" }} data={[{ label: "Overall", value: "overall" }, ...data.eventOptions.map((event) => ({ label: event.name, value: String(event.id) }))]} label="Event" value={query.eventId ? String(query.eventId) : "overall"} onChange={(value) => update({ eventId: value === "overall" ? undefined : Number(value), page: 1 })} /></Box>
    {!data.scope.available && <Alert title="Statistics unavailable">Statistics are unavailable for this event.</Alert>}
    <PlayerStatSummary stats={[{ label: "PTS", value: stats.points.toFixed(1) }, { label: "REB", value: stats.rebounds.toFixed(1) }, { label: "AST", value: stats.assists.toFixed(1) }, { label: "FG%", value: pct(stats.fieldGoalPercentage) }, { label: "3PT%", value: pct(stats.threePointPercentage) }, { label: "RATING", value: stats.rating.toFixed(1) }]} />
    <Box className="player-match-history-section"><PlayerMatchHistory matches={data.matches.items} /><TurnPageControls activePage={data.matches.pagination.page} pageSize={pageSize} totalItems={data.matches.pagination.totalItems} onPageChange={(page) => update({ ...query, page })} /></Box>
  </Stack>;
}
