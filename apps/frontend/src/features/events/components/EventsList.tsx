import { Box } from "@mantine/core";
import { EventSummaryCard } from "./EventSummaryCard";
import type { EventListItem } from "../types";

type EventsListProps = {
  events: EventListItem[];
};

export function EventsList({ events }: EventsListProps) {
  return (
    <Box className="events-list">
      {events.map((event) => (
        <EventSummaryCard event={event} key={event.id} />
      ))}
    </Box>
  );
}
