import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { Trophy } from "lucide-react";
import type { EventResultTag } from "../types";

type EventResultTagsPanelProps = {
  tags: EventResultTag[];
};

export function EventResultTagsPanel({ tags }: EventResultTagsPanelProps) {
  return (
    <Box className="event-detail-panel">
      <Stack gap="md">
        <Box>
          <Title className="event-panel-title" order={2}>
            Result Tags
          </Title>
        </Box>

        <Group className="event-tag-chip-row" gap="xs">
          {tags.map((tag) => (
            <Group
              className="event-result-chip"
              gap={7}
              data-winner={tag.isWinnerTag || undefined}
              key={tag.id}
              wrap="nowrap"
            >
              {tag.isWinnerTag ? <Trophy size={15} /> : null}
              <Text>{tag.label}</Text>
            </Group>
          ))}
        </Group>
      </Stack>
    </Box>
  );
}
