import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { Save } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { EventIdentityFields } from "./EventIdentityFields";
import {
  EventParticipantsSelector,
  type EventParticipantTeam
} from "./EventParticipantsSelector";
import { EventResultTagsEditor } from "./EventResultTagsEditor";
import { EventStageTagsEditor } from "./EventStageTagsEditor";
import type { EventSummary } from "../types";
import "./EventForm.css";

type EventFormProps = {
  event: EventSummary;
  mode: "create" | "edit";
  onCancel: () => void;
};

const mockParticipantTeams: EventParticipantTeam[] = [
  { id: "falcon-united", name: "Falcon United" },
  { id: "harbor-kings", name: "Harbor Kings" },
  { id: "metro-rangers", name: "Metro Rangers" },
  { id: "valley-strikers", name: "Valley Strikers" },
  { id: "summit-athletic", name: "Summit Athletic" },
  { id: "northside-crew", name: "Northside Crew" },
  { id: "cedar-city", name: "Cedar City" },
  { id: "ironbridge-fc", name: "Ironbridge FC" },
  { id: "coastal-wolves", name: "Coastal Wolves" },
  { id: "redwood-town", name: "Redwood Town" }
];

export function EventForm({ event, mode, onCancel }: EventFormProps) {
  const [description, setDescription] = useState(event.description);
  const [name, setName] = useState(event.name);
  const [resultTags, setResultTags] = useState(event.resultTags);
  const [stageTags, setStageTags] = useState(event.stageTags);
  const [status, setStatus] = useState(event.status);
  const [tier, setTier] = useState(event.tier);
  const [selectedParticipantTeamIds, setSelectedParticipantTeamIds] = useState(
    mockParticipantTeams.map((team) => team.id)
  );
  const [saveMessage, setSaveMessage] = useState("");

  function handleSubmit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    setSaveMessage("UI-only save prepared. Backend persistence is not connected yet.");
  }

  return (
    <Box className="event-form-shell" component="form" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Group align="flex-start" className="event-form-header" justify="space-between">
          <Box>
            <Text className="eyebrow">Tournament setup</Text>
            <Title className="page-title" order={1}>
              {mode === "create" ? "Create Event" : "Edit Event"}
            </Title>
            <Text className="page-summary" maw={640} mt="xs">
              Configure event identity, match stage labels, and placement-based ranking points.
            </Text>
          </Box>

          <Group className="event-form-actions" gap="sm">
            <Button className="event-form-cancel-button" onClick={onCancel} type="button" variant="subtle">
              Cancel
            </Button>
            <Button className="event-form-save-button" leftSection={<Save size={16} />} type="submit">
              Save
            </Button>
          </Group>
        </Group>

        <EventIdentityFields
          description={description}
          name={name}
          onDescriptionChange={setDescription}
          onNameChange={setName}
          onStatusChange={setStatus}
          onTierChange={setTier}
          status={status}
          tier={tier}
        />

        <EventParticipantsSelector
          onChange={setSelectedParticipantTeamIds}
          selectedTeamIds={selectedParticipantTeamIds}
          teams={mockParticipantTeams}
        />

        <EventStageTagsEditor onChange={setStageTags} tags={stageTags} />
        <EventResultTagsEditor onChange={setResultTags} tags={resultTags} />

        {saveMessage ? <Text className="event-form-save-message">{saveMessage}</Text> : null}
      </Stack>
    </Box>
  );
}
