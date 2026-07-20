import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { UsersRound } from "lucide-react";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventTierBadge } from "./EventTierBadge";
import type { EventDetail } from "../types";

type EventDetailHeroProps = {
  event: EventDetail;
};

export function EventDetailHero({ event }: EventDetailHeroProps) {
  return (
    <Box className="event-detail-hero">
      <Box className="event-detail-insignia-field">
        <EventTierBadge size="detail" tier={event.tier} />
      </Box>

      <Stack className="event-detail-hero-main" gap="lg">
        <Stack gap="sm">
          <Group align="flex-start" gap="md" justify="space-between">
            <Title className="event-detail-title" order={1}>{event.name}</Title>
            <EventStatusBadge status={event.status} />
          </Group>
          {event.description ? <Text className="event-detail-description">{event.description}</Text> : null}
        </Stack>

        <Group className="event-detail-inline-fact" gap="sm" wrap="nowrap">
          <UsersRound aria-hidden="true" size={16} />
          <Text className="event-detail-inline-fact-label">Participants</Text>
          <Text className="event-detail-inline-fact-value">{event.participants.length} teams</Text>
        </Group>
      </Stack>
    </Box>
  );
}
