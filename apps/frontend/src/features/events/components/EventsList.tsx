import { Box, Skeleton } from "@mantine/core";
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

export function EventsListSkeleton() {
  return (
    <Box aria-label="Loading events" className="events-list">
      {[0, 1].map((item) => (
        <Box aria-hidden="true" className="event-summary-card event-summary-card--skeleton" key={item}>
          <Box className="event-card-insignia-rail">
            <Skeleton circle height={68} width={68} />
          </Box>
          <Box className="event-card-skeleton-content">
            <Skeleton height={22} radius="sm" width="58%" />
            <Skeleton height={13} mt="md" radius="sm" width="88%" />
            <Skeleton height={13} mt="xs" radius="sm" width="72%" />
            <Skeleton height={1} mt="xl" radius={0} />
            <Skeleton height={12} mt="md" radius="sm" width="42%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
