import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import { EventsList } from "../../features/events/components/EventsList";
import { mockEvents } from "../../features/events/data/mockEvents";
import "./EventsPage.css";

export function EventsPage() {
  return (
    <Stack className="events-page" gap="xl">
      <Group align="flex-start" className="events-header" justify="space-between">
        <Box>
          <Text className="eyebrow">Tournament archive</Text>
          <Title className="page-title" order={1}>
            Events
          </Title>
          <Text className="page-summary" maw={620} mt="xs">
            Browse league events, tournament rules, and completed winners from the
            current MVP event board.
          </Text>
        </Box>

        <Button
          className="create-event-button"
          leftSection={<Plus size={17} />}
          size="sm"
          type="button"
        >
          Create Event
        </Button>
      </Group>

      <EventsList events={mockEvents} />
    </Stack>
  );
}
