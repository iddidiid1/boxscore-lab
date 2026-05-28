import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { Plus, Trash2 } from "lucide-react";
import type { EventResultTag } from "../types";

type EventResultTagsEditorProps = {
  onChange: (tags: EventResultTag[]) => void;
  tags: EventResultTag[];
};

function createTagId(label: string) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function EventResultTagsEditor({ onChange, tags }: EventResultTagsEditorProps) {
  function addTag() {
    onChange([
      ...tags,
      {
        id: `result-${Date.now()}`,
        isWinnerTag: false,
        label: "",
        rankingPoints: 0
      }
    ]);
  }

  function updateTag(tagId: string, updates: Partial<EventResultTag>) {
    onChange(
      tags.map((tag) => {
        if (tag.id !== tagId) {
          return tag;
        }

        const nextLabel = updates.label ?? tag.label;

        return {
          ...tag,
          ...updates,
          id: updates.label === undefined ? tag.id : createTagId(nextLabel) || tag.id
        };
      })
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
            <Text className="event-form-kicker">Placement rules</Text>
            <Title className="event-form-title" order={2}>
              Result Tags
            </Title>
          </Box>

          <Button className="event-form-secondary-button" leftSection={<Plus size={16} />} onClick={addTag}>
            Add Result
          </Button>
        </Group>

        <Box className="event-result-tags-editor-wrap">
          <Table className="event-result-tags-editor-table" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Label</Table.Th>
                <Table.Th>Winner</Table.Th>
                <Table.Th>Ranking Points</Table.Th>
                <Table.Th aria-label="Actions" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tags.map((tag) => (
                <Table.Tr key={tag.id}>
                  <Table.Td>
                    <TextInput
                      aria-label="Result tag label"
                      classNames={{ input: "event-form-input" }}
                      onChange={(event) => updateTag(tag.id, { label: event.currentTarget.value })}
                      placeholder="Result label"
                      value={tag.label}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Checkbox
                      aria-label={`${tag.label || "Result tag"} is winner tag`}
                      checked={tag.isWinnerTag}
                      classNames={{ input: "event-form-checkbox" }}
                      onChange={(event) =>
                        updateTag(tag.id, { isWinnerTag: event.currentTarget.checked })
                      }
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      aria-label={`${tag.label || "Result tag"} ranking points`}
                      classNames={{ input: "event-form-input" }}
                      min={0}
                      onChange={(value) =>
                        updateTag(tag.id, {
                          rankingPoints: typeof value === "number" ? value : Number(value) || 0
                        })
                      }
                      value={tag.rankingPoints}
                    />
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      aria-label={`Delete ${tag.label || "result tag"}`}
                      className="event-form-delete-button"
                      onClick={() => deleteTag(tag.id)}
                      variant="subtle"
                    >
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Stack>
    </Box>
  );
}
