import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { UsersRound } from "lucide-react";
import { EventTierBadge } from "./EventTierBadge";
import type { EventDetail, EventStatus } from "../types";

type EventDetailHeroProps = {
  event: EventDetail;
};

const statusLabels: Record<EventStatus, string> = {
  PREPARING: "Preparing",
  ONGOING: "Ongoing",
  COMPLETED: "Completed"
};

export function EventDetailHero({ event }: EventDetailHeroProps) {
  return (
    <Box className="event-detail-hero">
      <EventTierBadge tier={event.tier} />

      <Stack className="event-detail-hero-main" gap="lg">
        <Stack gap="sm">
          <Title className="event-detail-title" order={1}>
            {event.name}
          </Title>
          <Text className="event-detail-status">{statusLabels[event.status]}</Text>
          <Text className="event-detail-description">{event.description}</Text>
        </Stack>

        <Group className="event-detail-meta" gap="xs" wrap="nowrap">
          <UsersRound size={17} />
          <Text>{event.participants.length} participating teams</Text>
        </Group>
      </Stack>
    </Box>
  );
}
