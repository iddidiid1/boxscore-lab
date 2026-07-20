import { Box, Group, Stack, Text, Title } from "@mantine/core";
import type { EventStageTag } from "../types";

type EventStageTagsPanelProps = {
  tags: EventStageTag[];
};

export function EventStageTagsPanel({ tags }: EventStageTagsPanelProps) {
  return (
    <Box className="event-tag-section">
      <Stack gap="md">
        <Box>
          <Title className="event-panel-title" order={2}>
            Match Stage Tags
          </Title>
        </Box>

        <Group className="event-tag-chip-row" gap="xs">
          {tags.map((tag) => (
            <Box className="event-stage-chip app-edge-plate" key={tag.id}>
              <Text>{tag.label}</Text>
            </Box>
          ))}
        </Group>
        {tags.length === 0 ? <Text className="event-detail-fallback-note">No match stage tags.</Text> : null}
      </Stack>
    </Box>
  );
}
