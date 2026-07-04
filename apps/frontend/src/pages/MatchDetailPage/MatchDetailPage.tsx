import { Alert, Anchor, Box, Button, Center, Group, Loader, Stack } from "@mantine/core";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMatch, restoreMatch, voidMatch, type MatchDetail } from "../../features/matches";
import { ApiClientError } from "../../features/teams/api/teams";
import { ConfirmModal } from "../../shared/components/ConfirmModal";
import { MatchBoxScoreTable, MatchScoreHeader } from "./components";
import "./MatchDetailPage.css";

export function MatchDetailPage({ matchId }: { matchId: string }) {
  const id = Number(matchId);
  const [match, setMatch] = useState<MatchDetail>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"void" | "restore" | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError(undefined);
    fetchMatch(id, controller.signal).then(setMatch).catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof ApiClientError && reason.response.statusCode === 404 ? "Match not found." : reason instanceof Error ? reason.message : "Unable to load match."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, reload]);

  async function mutate(action: "void" | "restore") {
    setConfirmAction(null);
    setSubmitting(true); setError(undefined);
    try { if (action === "void") await voidMatch(id); else await restoreMatch(id); setReload((value) => value + 1); }
    catch (reason) { setError(reason instanceof ApiClientError ? [reason.response.message, ...reason.response.details.map((detail) => detail.message)].join(" ") : "Action failed."); }
    finally { setSubmitting(false); }
  }

  if (loading) return <Center py="xl"><Loader aria-label="Loading match" /></Center>;
  if (!match) return <Alert color="red" title={error ?? "Unable to load match"}><Button onClick={() => setReload((value) => value + 1)} size="xs">Retry</Button></Alert>;
  const eventUnavailable = match.event.archivedAt !== null || match.event.deletedAt !== null || !["ONGOING", "COMPLETED"].includes(match.event.status);
  const home = match.teams.find((team) => team.role === "HOME")!;
  const away = match.teams.find((team) => team.role === "AWAY")!;
  return <Stack className="match-detail-page" gap="md">
    <Group className="match-detail-actions" justify="space-between"><Anchor className="match-detail-back-link" href="/matches">← Back to Matches</Anchor><Group>
      {!match.voidedAt && !eventUnavailable ? <><Button className="edit-match-button app-action-button app-action-button--primary" component="a" href={`/matches/${match.id}/edit`} leftSection={<Pencil size={16} />}>Edit Match</Button><Button className="app-action-button app-action-button--danger" disabled={submitting} onClick={() => setConfirmAction("void")} variant="outline">Void Match</Button></> : null}
      {match.voidedAt && !eventUnavailable ? <Button className="app-action-button app-action-button--primary" disabled={submitting} onClick={() => setConfirmAction("restore")}>Restore Match</Button> : null}
    </Group></Group>
    {match.voidedAt ? <Alert color="orange" title="Voided match">Voided at {new Date(match.voidedAt).toLocaleString()}.</Alert> : null}
    {eventUnavailable ? <Alert color="gray" title="Historical match">The Event is archived, deleted, or otherwise unavailable. This record is read-only.</Alert> : null}
    {error ? <Alert color="red">{error}</Alert> : null}
    <MatchScoreHeader match={match} />
    <Box className="match-box-score-grid"><MatchBoxScoreTable otherStats={home.otherStats} players={home.playerStats} teamColor={home.team.primaryColor} title={home.team.name} /><MatchBoxScoreTable otherStats={away.otherStats} players={away.playerStats} teamColor={away.team.primaryColor} title={away.team.name} /></Box>
    <ConfirmModal
      confirmLabel={confirmAction === "void" ? "Void Match" : "Restore Match"}
      danger={confirmAction === "void"}
      loading={submitting}
      onCancel={() => setConfirmAction(null)}
      onConfirm={() => confirmAction && mutate(confirmAction)}
      opened={confirmAction !== null}
      title={confirmAction === "void" ? "Void Match" : "Restore Match"}
    >
      {confirmAction === "void" ? "This Match will be excluded from all statistics." : "This Match will return to lists and statistics."}
    </ConfirmModal>
  </Stack>;
}
