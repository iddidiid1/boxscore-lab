import { Alert, Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEvents } from "../../features/events/api/events";
import { EventsList, EventsListSkeleton } from "../../features/events/components/EventsList";
import type { EventListItem } from "../../features/events/types";
import { ListEmptyState } from "../../shared/components/ListEmptyState";
import "./EventsPage.css";

export function EventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    fetchEvents(controller.signal).then((data) => setEvents(data.events)).catch((reason) => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "Unable to load events.");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, [retry]);
  return (
    <Stack className="events-page" gap="xl">
      <Group align="flex-start" className="events-header" justify="space-between">
        <Box><Title className="page-title" order={1}>Events</Title><Text className="page-summary" maw={620} mt="xs">Manage event configuration, participants, results, and awards.</Text></Box>
        <Button className="create-event-button app-action-button app-action-button--primary" component="a" href="/events/new" leftSection={<Plus size={16} />}>Create Event</Button>
      </Group>
      {loading ? <EventsListSkeleton /> : null}
      {error ? <Alert color="red" title="Unable to load events">{error}<Button className="app-action-button app-action-button--context" mt="sm" onClick={() => setRetry((value) => value + 1)} size="xs" variant="outline">Retry</Button></Alert> : null}
      {!loading && !error && events.length === 0 ? (
        <ListEmptyState
          description="Create the first event to begin building the competition board."
          title="No events yet"
        />
      ) : null}
      {!loading && !error ? <EventsList events={events} /> : null}
    </Stack>
  );
}
