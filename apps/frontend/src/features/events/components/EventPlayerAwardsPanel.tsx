import { Box, Group, Text, Title } from "@mantine/core";
import { Trophy } from "lucide-react";
import type { EventPlayerAward } from "../types";

type EventPlayerAwardsPanelProps = { awards: EventPlayerAward[] };
type AwardTeamRowProps = {
  awards: EventPlayerAward[];
  mvpPlayerId?: number;
  secondary?: boolean;
  title: string;
};

function AwardTeamRow({ awards, mvpPlayerId, secondary = false, title }: AwardTeamRowProps) {
  if (awards.length === 0) return null;
  return (
    <Box className="event-awards-team-section" data-secondary={secondary || undefined}>
      <Text className="event-awards-team-label">{title}</Text>
      <Box className="event-awards-team-grid">
        {awards.map((award) => (
          <Box className="event-awards-player-cell" key={award.id}>
            <Group align="flex-start" className="event-awards-player-heading" gap="xs" justify="space-between" wrap="nowrap">
              <Text className="event-awards-player-name">{award.playerName}</Text>
              <Text className="event-awards-player-position">{award.playerPosition}</Text>
            </Group>
            <Text className="event-awards-player-team">{award.teamName}</Text>
            <Group className="event-awards-player-markers" gap="xs">
              {award.playerId === mvpPlayerId ? (
                <Group className="event-awards-inline-mvp" gap={4} wrap="nowrap">
                  <Trophy aria-hidden="true" size={11} />
                  <Text>MVP</Text>
                </Group>
              ) : null}
              {!award.playerIsActive ? <Text className="event-awards-player-status">Inactive</Text> : null}
            </Group>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function EventPlayerAwardsPanel({ awards }: EventPlayerAwardsPanelProps) {
  const mvp = awards.find((award) => award.awardType === "EVENT_MVP");
  const firstTeam = awards.filter((award) => award.awardType === "ALL_EVENT_FIRST_TEAM");
  const secondTeam = awards.filter((award) => award.awardType === "ALL_EVENT_SECOND_TEAM");

  return (
    <Box className="event-player-awards-plaque">
      <Box aria-hidden="true" className="event-awards-registration event-awards-registration--top" />
      <Box aria-hidden="true" className="event-awards-registration event-awards-registration--bottom" />
      <Title className="event-awards-plaque-title" order={2}>Player Awards</Title>
      {awards.length === 0 ? <Text className="event-detail-fallback-note">No player awards recorded.</Text> : null}
      {mvp ? (
        <Box className="event-awards-mvp-field">
          <Group className="event-awards-mvp-label" gap="xs">
            <Trophy aria-hidden="true" size={17} />
            <Text>Event MVP</Text>
          </Group>
          <Group align="baseline" className="event-awards-mvp-identity" gap="sm" wrap="nowrap">
            <Text className="event-awards-mvp-name">{mvp.playerName}</Text>
            <Text className="event-awards-player-position event-awards-mvp-position">{mvp.playerPosition}</Text>
          </Group>
          <Group gap="sm">
            <Text className="event-awards-mvp-team">{mvp.teamName}</Text>
            {!mvp.playerIsActive ? <Text className="event-awards-player-status">Inactive</Text> : null}
          </Group>
        </Box>
      ) : null}
      <AwardTeamRow awards={firstTeam} mvpPlayerId={mvp?.playerId} title="All-Event First Team" />
      <AwardTeamRow awards={secondTeam} mvpPlayerId={mvp?.playerId} secondary title="All-Event Second Team" />
    </Box>
  );
}
