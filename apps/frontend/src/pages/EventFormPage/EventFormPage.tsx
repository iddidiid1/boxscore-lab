import { Alert, Loader } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { archiveEvent, createEvent, fetchEvent, updateEvent } from "../../features/events/api/events";
import { EventForm } from "../../features/events";
import type { EventConfigurationPayload, EventDetail, TeamOption } from "../../features/events/types";
import { fetchTeams } from "../../features/teams/api/teams";
import { ConfirmModal } from "../../shared/components/ConfirmModal";

function navigate(path: string) { window.history.pushState({}, "", path); window.dispatchEvent(new PopStateEvent("popstate")); }
export function EventFormPage({ eventId, mode }: { eventId?: string; mode: "create" | "edit" }) {
  const [event, setEvent] = useState<EventDetail | null>(null); const [activeTeams, setActiveTeams] = useState<TeamOption[]>([]);
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(""); const [archiveConfirm, setArchiveConfirm] = useState(false);
  async function load() { setLoading(true); setError(""); try { const [teamsData, eventData] = await Promise.all([fetchTeams(), mode === "edit" && eventId ? fetchEvent(eventId) : Promise.resolve(null)]); setEvent(eventData); setActiveTeams(teamsData.divisions.flatMap((division) => division.teams.map((team) => ({ teamId: team.id, teamSlug: team.slug, teamName: team.name, divisionId: division.divisionId, divisionName: division.divisionName, isEligible: true })))); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load event form."); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [eventId, mode]);
  const teams = useMemo(() => { const map = new Map(activeTeams.map((team) => [team.teamId, team])); event?.participants.forEach((participant) => { if (!map.has(participant.teamId)) map.set(participant.teamId, { teamId: participant.teamId, teamSlug: participant.teamSlug, teamName: participant.teamName, divisionId: participant.divisionId, divisionName: participant.divisionName, isEligible: participant.isEligible, unavailableReason: "Unavailable" }); }); return [...map.values()]; }, [activeTeams, event]);
  async function save(payload: EventConfigurationPayload) { setSubmitting(true); setError(""); try { const saved = mode === "create" ? await createEvent(payload) : await updateEvent(eventId!, payload); navigate(`/events/${saved.slug}`); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save event."); } finally { setSubmitting(false); } }
  async function changeStatus(status: "ONGOING" | "COMPLETED", payload: EventConfigurationPayload) { if (!event) return; if (event.status === "COMPLETED" && status === "ONGOING" && !window.confirm("Reopen this completed event for corrections?")) return; setSubmitting(true); setError(""); try { if (event.status !== "COMPLETED") await updateEvent(event.slug, payload); const updated = await updateEvent(event.slug, { status }); setEvent(updated); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to change event status."); } finally { setSubmitting(false); } }
  async function confirmArchive() { if (!event) return; setArchiveConfirm(false); setSubmitting(true); try { await archiveEvent(event.slug); navigate("/events"); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to archive event."); setSubmitting(false); } }
  if (loading) return <Loader size="sm"/>; if (mode === "edit" && !event && error) return <Alert color="red">{error}</Alert>;
  return <>
    <EventForm event={event} mode={mode} teams={teams} readOnly={Boolean(event?.archivedAt) || event?.status === "COMPLETED"} submitting={submitting} error={error} onCancel={() => navigate(event ? `/events/${event.slug}` : "/events")} onSave={save} onStatusChange={changeStatus} onArchive={event?.archivedAt ? undefined : () => setArchiveConfirm(true)}/>
    <ConfirmModal confirmLabel="Archive Event" danger loading={submitting} onCancel={() => setArchiveConfirm(false)} onConfirm={confirmArchive} opened={archiveConfirm} title="Archive Event">
      This event will be removed from the default list. Historical data remains available and read-only.
    </ConfirmModal>
  </>;
}
