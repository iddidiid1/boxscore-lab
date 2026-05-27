import { Box, Group, Select, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import type { EventStatus, EventTier } from "../types";

type EventIdentityFieldsProps = {
  description: string;
  name: string;
  onDescriptionChange: (description: string) => void;
  onNameChange: (name: string) => void;
  onStatusChange: (status: EventStatus) => void;
  onTierChange: (tier: EventTier) => void;
  status: EventStatus;
  tier: EventTier;
};

const tierOptions: EventTier[] = ["S", "A", "B", "C"];

const statusOptions: Array<{ label: string; value: EventStatus }> = [
  { label: "Preparing", value: "preparing" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" }
];

export function EventIdentityFields({
  description,
  name,
  onDescriptionChange,
  onNameChange,
  onStatusChange,
  onTierChange,
  status,
  tier
}: EventIdentityFieldsProps) {
  return (
    <Box className="event-form-panel">
      <Stack gap="md">
        <Box>
          <Text className="event-form-kicker">Event setup</Text>
          <Title className="event-form-title" order={2}>
            Event Identity
          </Title>
        </Box>

        <Group align="flex-start" grow>
          <Select
            allowDeselect={false}
            classNames={{ input: "event-form-input", label: "event-form-label" }}
            data={tierOptions}
            label="Tier"
            onChange={(value) => onTierChange((value ?? tier) as EventTier)}
            value={tier}
          />
          <Select
            allowDeselect={false}
            classNames={{ input: "event-form-input", label: "event-form-label" }}
            data={statusOptions}
            label="Status"
            onChange={(value) => onStatusChange((value ?? status) as EventStatus)}
            value={status}
          />
        </Group>

        <TextInput
          classNames={{ input: "event-form-input", label: "event-form-label" }}
          label="Event Name"
          onChange={(event) => onNameChange(event.currentTarget.value)}
          value={name}
        />

        <Textarea
          autosize
          classNames={{ input: "event-form-textarea", label: "event-form-label" }}
          label="Summary / Rules"
          minRows={5}
          onChange={(event) => onDescriptionChange(event.currentTarget.value)}
          value={description}
        />
      </Stack>
    </Box>
  );
}
