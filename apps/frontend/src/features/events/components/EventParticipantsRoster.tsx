import { Badge, Box, Group, Text, Title } from "@mantine/core";
import type { EventParticipant } from "../types";

type EventParticipantsRosterProps = {
  participants: EventParticipant[];
};

export function EventParticipantsRoster({ participants }: EventParticipantsRosterProps) {
  return (
    <Box className="event-participants-roster">
      <Title className="event-panel-title" order={2}>Participants</Title>
      {participants.length ? (
        <Box className="event-participants-roster-grid">
          {participants.map((participant) => (
            <Group className="event-participant-roster-cell" gap="sm" justify="space-between" key={participant.teamId} wrap="nowrap">
              <Text className="event-participant-roster-name">{participant.teamName}</Text>
              {!participant.isEligible ? (
                <Badge className="event-participant-unavailable app-edge-plate" variant="outline">
                  Unavailable
                </Badge>
              ) : null}
            </Group>
          ))}
        </Box>
      ) : (
        <Text className="event-detail-fallback-note">No participating teams.</Text>
      )}
    </Box>
  );
}
