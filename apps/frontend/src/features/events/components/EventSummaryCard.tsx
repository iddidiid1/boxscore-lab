import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { Crown, UsersRound } from "lucide-react";
import { EventTierBadge } from "./EventTierBadge";
import type { EventListItem } from "../types";

type EventSummaryCardProps = {
  event: EventListItem;
};

const statusLabels: Record<EventListItem["status"], string> = {
  PREPARING: "Preparing",
  ONGOING: "Ongoing",
  COMPLETED: "Completed"
};

export function EventSummaryCard({ event }: EventSummaryCardProps) {
  const shouldShowWinner = Boolean(event.champion);

  return (
    <Box
      aria-label={`View ${event.name} event details`}
      className="event-summary-card app-panel"
      component="a"
      href={`/events/${event.slug}`}
    >
      <EventTierBadge tier={event.tier} />

      <Stack className="event-card-content" gap="lg">
        <Stack gap="sm">
          <Title className="event-card-title" order={2}>
            {event.name}
          </Title>

          <Text className="event-card-description">{event.description}</Text>
        </Stack>

        <Stack className="event-card-result" gap="md">
          {shouldShowWinner ? (
            <Group className="event-winner-preview" gap="sm" wrap="nowrap">
              <Box className="event-winner-icon">
                <Crown size={18} />
              </Box>
              <Box>
                <Text className="event-winner-label">Champion</Text>
                <Text className="event-winner-name">{event.champion?.teamName}</Text>
              </Box>
            </Group>
          ) : null}

          <Group className="event-card-footer" justify="space-between">
            <Group className="event-card-stat" gap="xs" wrap="nowrap">
              <UsersRound size={16} />
              <Text>{event.participatingTeamCount} teams entered</Text>
            </Group>

            <Group className="event-footer-status" data-status={event.status} gap={6} wrap="nowrap">
              <Text>{statusLabels[event.status]}</Text>
            </Group>
          </Group>
        </Stack>
      </Stack>
    </Box>
  );
}
