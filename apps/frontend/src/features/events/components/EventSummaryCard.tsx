import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { ArrowUpRight, Trophy, UsersRound } from "lucide-react";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventTierBadge } from "./EventTierBadge";
import type { EventListItem } from "../types";

type EventSummaryCardProps = {
  event: EventListItem;
};

export function EventSummaryCard({ event }: EventSummaryCardProps) {
  const shouldShowChampion = event.status === "COMPLETED" && Boolean(event.champion);

  return (
    <Box
      aria-label={`View ${event.name} event details`}
      className="event-summary-card"
      component="a"
      href={`/events/${event.slug}`}
    >
      <Box className="event-card-insignia-rail">
        <EventTierBadge tier={event.tier} />
      </Box>

      <Stack className="event-card-content" gap="md">
        <Stack gap="sm">
          <Group align="flex-start" gap="sm" justify="space-between" wrap="nowrap">
            <Title className="event-card-title" order={2}>{event.name}</Title>
            <EventStatusBadge status={event.status} />
          </Group>
          {event.description ? <Text className="event-card-description">{event.description}</Text> : null}
        </Stack>

        {shouldShowChampion ? (
          <Group className="event-champion-strip" gap="sm" wrap="nowrap">
            <Trophy aria-hidden="true" size={17} />
            <Box className="event-champion-copy">
              <Text className="event-champion-label">Champion</Text>
              <Text className="event-champion-name">{event.champion?.teamName}</Text>
            </Box>
          </Group>
        ) : null}

        <Group className="event-card-footer" justify="space-between">
          <Group className="event-card-stat" gap="xs" wrap="nowrap">
            <UsersRound aria-hidden="true" size={15} />
            <Text>{event.participatingTeamCount} teams entered</Text>
          </Group>
          <Group aria-hidden="true" className="event-card-destination" gap={5} wrap="nowrap">
            <Text>View event</Text>
            <ArrowUpRight size={14} />
          </Group>
        </Group>
      </Stack>
    </Box>
  );
}
