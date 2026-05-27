import { Box } from "@mantine/core";
import { EventSummaryCard } from "./EventSummaryCard";
import type { EventSummary } from "../types";

type EventsListProps = {
  events: EventSummary[];
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
