import { Alert, Box, Group, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
  createMatch,
  fetchMatch,
  fetchMatchFormOptions,
  updateMatch,
  type MatchDetail,
  type MatchFormEventOption,
  type MatchFormOptions,
  type MatchFormTeamOption,
  type MatchTeamPayload,
  type OtherStatPayload
} from "../../features/matches";
import { ApiClientError } from "../../features/teams/api/teams";
import { useIsDirty } from "../../shared/hooks/useIsDirty";
import { useUnsavedChangesWarning } from "../../shared/hooks/useUnsavedChangesWarning";
import { LoadingState } from "../../shared/components/LoadingState";
import { MatchFormActions, MatchInfoForm, MatchStatsInputTable } from "./components";
import { emptyOtherStats, emptyPlayerStats, toStatNumbers, type MatchFormPlayer, type MatchFormTeam, type TeamFormState } from "./types";
import "./CreateMatchPage.css";

type Props = { mode: "create" | "edit"; matchId?: number; cancelHref?: string; description: string; title: string };
const localDateTime = (iso: string) => { const date = new Date(iso); const pad = (value: number) => String(value).padStart(2, "0"); return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`; };
const formTeam = (team: MatchFormTeamOption): MatchFormTeam => ({ id: team.id, name: team.name, color: team.primaryColor, archivedAt: null, players: team.players.map((player) => ({ ...player, isActive: true })) });
const emptySide = (role: "HOME" | "AWAY"): TeamFormState => ({ role, entries: {}, otherStats: emptyOtherStats() });
const entriesFor = (team?: MatchFormTeam) => Object.fromEntries((team?.players ?? []).map((player) => [player.id, { appeared: false, stats: emptyPlayerStats() }]));
const navigate = (path: string) => { window.history.pushState({}, "", path); window.dispatchEvent(new PopStateEvent("popstate")); };

function editTeam(detail: MatchDetail, role: "HOME" | "AWAY", options?: MatchFormOptions["selectedEvent"]): TeamFormState {
  const saved = detail.teams.find((team) => team.role === role)!;
  const active = options?.teams.find((team) => team.id === saved.team.id);
  const players = new Map<number, MatchFormPlayer>();
  if (!saved.team.archivedAt) active?.players.forEach((player) => players.set(player.id, { ...player, isActive: true }));
  saved.playerStats.forEach((player) => players.set(player.playerId, { id: player.playerId, name: player.playerName, number: player.playerNumber, position: player.position, isActive: player.isActive }));
  const team: MatchFormTeam = { id: saved.team.id, name: saved.team.name, color: saved.team.primaryColor, archivedAt: saved.team.archivedAt, players: [...players.values()] };
  const entries = entriesFor(team);
  saved.playerStats.forEach((player) => { entries[player.playerId] = { appeared: true, stats: { points: player.points, rebounds: player.rebounds, assists: player.assists, fieldGoalsMade: player.fieldGoalsMade, fieldGoalsAttempted: player.fieldGoalsAttempted, threePointersMade: player.threePointersMade, threePointersAttempted: player.threePointersAttempted, minutes: player.minutes, rating: player.rating } }; });
  const { fieldGoalPercentage: _fg, threePointPercentage: _three, ...otherStats } = saved.otherStats;
  return { role, team, entries, otherStats };
}

export function MatchFormPage({ mode, matchId, cancelHref = "/matches", description, title }: Props) {
  const [events, setEvents] = useState<MatchFormEventOption[]>([]);
  const [options, setOptions] = useState<MatchFormOptions["selectedEvent"]>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [stageTagId, setStageTagId] = useState<number | null>(null);
  const [playedAt, setPlayedAt] = useState("");
  const [originalPlayedAt, setOriginalPlayedAt] = useState<string>();
  const [timeDirty, setTimeDirty] = useState(false);
  const [home, setHome] = useState<TeamFormState>(() => emptySide("HOME"));
  const [away, setAway] = useState<TeamFormState>(() => emptySide("AWAY"));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError(undefined);
    (async () => {
      const base = await fetchMatchFormOptions(undefined, controller.signal); setEvents(base.events);
      if (mode === "edit" && matchId) {
        const detail = await fetchMatch(matchId, controller.signal);
        const eventUnavailable = detail.voidedAt !== null || detail.event.archivedAt !== null || detail.event.deletedAt !== null || !["ONGOING", "COMPLETED"].includes(detail.event.status);
        if (eventUnavailable) { setUnavailable(true); return; }
        const selected = await fetchMatchFormOptions(detail.event.id, controller.signal); setOptions(selected.selectedEvent); setEventId(detail.event.id); setStageTagId(detail.stageTag?.id ?? null); setPlayedAt(localDateTime(detail.playedAt)); setOriginalPlayedAt(detail.playedAt); setHome(editTeam(detail, "HOME", selected.selectedEvent)); setAway(editTeam(detail, "AWAY", selected.selectedEvent));
      }
    })().catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Unable to load form."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [matchId, mode]);

  async function changeEvent(next: number | null) {
    setEventId(next); setStageTagId(null); setHome(emptySide("HOME")); setAway(emptySide("AWAY")); setOptions(null);
    if (!next) return;
    setLoading(true); setError(undefined);
    try { const response = await fetchMatchFormOptions(next); setOptions(response.selectedEvent); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load event options."); }
    finally { setLoading(false); }
  }

  const teams = useMemo(() => {
    const map = new Map<number, MatchFormTeam>(); options?.teams.forEach((team) => map.set(team.id, formTeam(team))); [home.team, away.team].forEach((team) => { if (team) map.set(team.id, team); }); return [...map.values()];
  }, [away.team, home.team, options]);
  function selectTeam(side: "home" | "away", id: number | null) { const team = teams.find((item) => item.id === id); const next = team ? { role: side === "home" ? "HOME" as const : "AWAY" as const, team, entries: entriesFor(team), otherStats: emptyOtherStats() } : emptySide(side === "home" ? "HOME" : "AWAY"); if (side === "home") setHome(next); else setAway(next); }
  function setEntry(side: "home" | "away", playerId: number, update: (current: TeamFormState["entries"][number]) => TeamFormState["entries"][number]) { const setter = side === "home" ? setHome : setAway; setter((current) => ({ ...current, entries: { ...current.entries, [playerId]: update(current.entries[playerId]!) } })); }
  const score = (side: TeamFormState) => Object.values(side.entries).filter((entry) => entry.appeared).reduce((sum, entry) => sum + (entry.stats.points ?? 0), side.otherStats.points ?? 0);
  const canSave = Boolean(eventId && playedAt && home.team && away.team && Object.values(home.entries).some((entry) => entry.appeared) && Object.values(away.entries).some((entry) => entry.appeared) && score(home) !== score(away));
  const payloadTeam = (side: TeamFormState): MatchTeamPayload => ({ role: side.role, teamId: side.team!.id, playerStats: Object.entries(side.entries).filter(([, entry]) => entry.appeared).map(([playerId, entry]) => ({ playerId: Number(playerId), ...toStatNumbers(entry.stats) })), otherStats: toStatNumbers(side.otherStats) });

  async function save() {
    if (!canSave || !eventId) { setError("Select both teams, at least one player per team, and enter a non-tied score."); return; }
    setSubmitting(true); setError(undefined);
    try {
      const iso = !timeDirty && originalPlayedAt ? originalPlayedAt : new Date(playedAt).toISOString();
      const teamsPayload = [payloadTeam(home), payloadTeam(away)];
      const result = mode === "create" ? await createMatch({ eventId, stageTagId, playedAt: iso, teams: teamsPayload }) : await updateMatch(matchId!, { stageTagId, playedAt: iso, teams: teamsPayload });
      navigate(`/matches/${result.id}`);
    } catch (reason) { setError(reason instanceof ApiClientError ? [reason.response.message, ...reason.response.details.map((detail) => `${detail.field}: ${detail.message}`)].join(" ") : "Unable to save match."); }
    finally { setSubmitting(false); }
  }

  const dirty = useIsDirty(JSON.stringify({ eventId, stageTagId, playedAt, home, away }), !loading && !unavailable);
  useUnsavedChangesWarning(dirty);

  if (loading) return <LoadingState label="Loading match form…" />;
  if (unavailable) return <Alert color="orange" title="Match cannot be edited">This Match is voided or its Event is unavailable. <a className="app-inline-link" href={cancelHref}>Return to detail.</a></Alert>;
  return <Stack className="create-match-page" gap="lg"><Group align="flex-start" className="create-match-header" justify="space-between"><Box><Title className="page-title" order={1}>{title}</Title><Text className="page-summary" maw={640} mt="xs">{description}</Text></Box><MatchFormActions canSave={canSave} cancelHref={cancelHref} mode={mode} onSave={save} submitting={submitting} /></Group>
    {error ? <Alert color="red" title="Unable to save match">{error}</Alert> : null}
    {events.length === 0 && mode === "create" ? <Alert title="No available Events">Create or reopen an Event before recording a Match.</Alert> : null}
    <MatchInfoForm awayTeamId={away.team?.id ?? null} eventId={eventId} events={events} homeTeamId={home.team?.id ?? null} mode={mode} onAwayChange={(id) => selectTeam("away", id)} onEventChange={changeEvent} onHomeChange={(id) => selectTeam("home", id)} onPlayedAtChange={(value) => { setPlayedAt(value); setTimeDirty(true); }} onStageChange={setStageTagId} playedAt={playedAt} stageTagId={stageTagId} stageTags={options?.stageTags ?? []} teams={teams} />
    {home.team ? <MatchStatsInputTable entries={home.entries} onOtherStatChange={(key, value) => setHome((current) => ({ ...current, otherStats: { ...current.otherStats, [key]: value } }))} onPlayerStatChange={(id, key, value) => setEntry("home", id, (entry) => ({ ...entry, stats: { ...entry.stats, [key]: value } }))} onToggle={(id, checked) => setEntry("home", id, () => ({ appeared: checked, stats: emptyPlayerStats() }))} otherStats={home.otherStats} role="HOME" team={home.team} /> : null}
    {away.team ? <MatchStatsInputTable entries={away.entries} onOtherStatChange={(key, value) => setAway((current) => ({ ...current, otherStats: { ...current.otherStats, [key]: value } }))} onPlayerStatChange={(id, key, value) => setEntry("away", id, (entry) => ({ ...entry, stats: { ...entry.stats, [key]: value } }))} onToggle={(id, checked) => setEntry("away", id, () => ({ appeared: checked, stats: emptyPlayerStats() }))} otherStats={away.otherStats} role="AWAY" team={away.team} /> : null}
  </Stack>;
}
