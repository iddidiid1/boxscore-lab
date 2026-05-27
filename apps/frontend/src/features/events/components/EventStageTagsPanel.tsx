import { Box, Group, Stack, Text, Title } from "@mantine/core";
import type { EventStageTag } from "../types";

type EventStageTagsPanelProps = {
  tags: EventStageTag[];
};

export function EventStageTagsPanel({ tags }: EventStageTagsPanelProps) {
  return (
    <Box className="event-detail-panel">
      <Stack gap="md">
        <Box>
          <Title className="event-panel-title" order={2}>
            Match Stage Tags
          </Title>
        </Box>

        <Group className="event-tag-chip-row" gap="xs">
          {tags.map((tag) => (
            <Box className="event-stage-chip" key={tag.id}>
              <Text>{tag.label}</Text>
            </Box>
          ))}
        </Group>
      </Stack>
    </Box>
  );
}
