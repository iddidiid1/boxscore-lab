import { ActionIcon, Box, Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { Plus, Trash2 } from "lucide-react";
import type { EventStageTag } from "../types";

type EventStageTagsEditorProps = {
  onChange: (tags: EventStageTag[]) => void;
  tags: EventStageTag[];
};

function createTagId(label: string) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function EventStageTagsEditor({ onChange, tags }: EventStageTagsEditorProps) {
  function addTag() {
    onChange([...tags, { id: `stage-${Date.now()}`, label: "" }]);
  }

  function updateTag(tagId: string, label: string) {
    onChange(
      tags.map((tag) =>
        tag.id === tagId ? { ...tag, id: createTagId(label) || tag.id, label } : tag
      )
    );
  }

  function deleteTag(tagId: string) {
    onChange(tags.filter((tag) => tag.id !== tagId));
  }

  return (
    <Box className="event-form-panel">
      <Stack gap="md">
        <Group justify="space-between">
          <Box>
            <Text className="event-form-kicker">Match metadata</Text>
            <Title className="event-form-title" order={2}>
              Match Stage Tags
            </Title>
          </Box>

          <Button className="event-form-secondary-button" leftSection={<Plus size={16} />} onClick={addTag}>
            Add Stage
          </Button>
        </Group>

        <Stack gap="xs">
          {tags.map((tag) => (
            <Group className="event-form-row" key={tag.id} wrap="nowrap">
              <TextInput
                aria-label="Stage tag label"
                classNames={{ input: "event-form-input" }}
                onChange={(event) => updateTag(tag.id, event.currentTarget.value)}
                placeholder="Stage label"
                value={tag.label}
              />
              <ActionIcon
                aria-label={`Delete ${tag.label || "stage tag"}`}
                className="event-form-delete-button"
                onClick={() => deleteTag(tag.id)}
                variant="subtle"
              >
                <Trash2 size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
