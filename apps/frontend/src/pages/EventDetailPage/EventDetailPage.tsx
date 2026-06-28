import { Alert, Anchor, Badge, Box, Button, Group, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Pencil, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEvent } from "../../features/events/api/events";
import { EventDetailHero, EventResultsTable, EventResultTagsPanel, EventStageTagsPanel } from "../../features/events";
import type { EventDetail } from "../../features/events/types";
import "./EventDetailPage.css";

export function EventDetailPage({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => { const controller = new AbortController(); setError(""); fetchEvent(eventId, controller.signal).then(setEvent).catch((reason) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(reason instanceof Error ? reason.message : "Unable to load event."); }); return () => controller.abort(); }, [eventId, retry]);
  if (error) return <Alert color="red" title="Unable to load event">{error}<Button mt="sm" onClick={() => setRetry((value) => value + 1)} size="xs">Retry</Button></Alert>;
  if (!event) return <Loader size="sm" />;
  const readOnly = Boolean(event.archivedAt) || event.status === "COMPLETED";
  return (
    <Stack className="event-detail-page" gap="lg">
      {event.archivedAt ? <Alert color="yellow" title="Archived event">Historical data is read-only.</Alert> : null}
      <Group className="event-detail-actions" justify="space-between"><Anchor className="event-detail-back-link" href="/events">← Back to Events</Anchor><Group>{!event.archivedAt ? <Button className="app-action-button app-action-button--primary" component="a" href={`/events/${event.slug}/edit`} leftSection={<Pencil size={16} />} size="sm">Edit Event</Button> : null}<Button component="a" href={`/events/${event.slug}/outcomes`} leftSection={<Trophy size={16} />} size="sm" variant="outline">{readOnly ? "View Results & Awards" : "Manage Results & Awards"}</Button></Group></Group>
      <EventDetailHero event={event} />
      <Box className="event-detail-panel"><Title order={2} className="event-panel-title">Participants</Title><SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="md">{event.participants.map((participant) => <Group key={participant.teamId}><Text>{participant.teamName}</Text>{!participant.isEligible ? <Badge color="yellow">Unavailable</Badge> : null}</Group>)}</SimpleGrid>{event.participants.length === 0 ? <Text c="dimmed">No participating teams.</Text> : null}</Box>
      <EventStageTagsPanel tags={event.stageTags} /><EventResultTagsPanel tags={event.resultTags} /><EventResultsTable resultTags={event.resultTags} results={event.teamResults} />
      <Box className="event-detail-panel"><Title order={2} className="event-panel-title">Player Awards</Title><Stack mt="md" gap="xs">{event.playerAwards.map((award) => <Group key={award.id}><Badge>{award.awardType.replace(/_/g, " ")}</Badge><Text>{award.playerName} · {award.teamName}</Text>{!award.playerIsActive ? <Badge color="yellow">Inactive</Badge> : null}</Group>)}{event.playerAwards.length === 0 ? <Text c="dimmed">No player awards recorded.</Text> : null}</Stack></Box>
    </Stack>
  );
}
