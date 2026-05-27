import { Anchor, Button, Group, Stack, Text } from "@mantine/core";
import { Pencil } from "lucide-react";
import {
  EventDetailHero,
  EventResultsTable,
  EventResultTagsPanel,
  EventStageTagsPanel
} from "../../features/events";
import { mockEvents } from "../../features/events/data/mockEvents";
import "./EventDetailPage.css";

type EventDetailPageProps = {
  eventId: string;
};

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const event = mockEvents.find((eventItem) => eventItem.id === eventId) ?? mockEvents[0];

  return (
    <Stack className="event-detail-page" gap="lg">
      <Group className="event-detail-actions" justify="space-between">
        <Anchor className="event-detail-back-link" href="/events">
          {"\u2190 Back to Events"}
        </Anchor>

        <Button
          className="edit-event-button"
          component="a"
          href={`/events/${event.id}/edit`}
          leftSection={<Pencil size={16} />}
          size="sm"
        >
          Edit Event
        </Button>
      </Group>

      <EventDetailHero event={event} />

      <EventStageTagsPanel tags={event.stageTags} />
      <EventResultTagsPanel tags={event.resultTags} />
      <EventResultsTable resultTags={event.resultTags} results={event.results} />

      {event.id !== eventId ? (
        <Text className="event-detail-fallback-note">
          Showing mock event data until this event archive is connected.
        </Text>
      ) : null}
    </Stack>
  );
}
