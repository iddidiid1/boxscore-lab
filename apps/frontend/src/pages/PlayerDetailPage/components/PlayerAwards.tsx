import { Box, Text } from "@mantine/core";
import { Medal, Star, Trophy, type LucideIcon } from "lucide-react";

type AwardItem = {
  id: number;
  awardType: string;
  notes: string | null;
  event: { name: string };
  team: { name: string };
};

type PlayerAwardsProps = {
  awards: AwardItem[];
};

const awardMetadata: Record<
  string,
  { icon: LucideIcon; label: string; tone: "gold" | "strong" | "neutral" }
> = {
  EVENT_MVP: { icon: Trophy, label: "Event MVP", tone: "gold" },
  ALL_EVENT_FIRST_TEAM: {
    icon: Star,
    label: "All-Event First Team",
    tone: "strong"
  },
  ALL_EVENT_SECOND_TEAM: {
    icon: Medal,
    label: "All-Event Second Team",
    tone: "neutral"
  }
};

function readableAwardType(awardType: string) {
  return awardType
    .toLowerCase()
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function PlayerAwards({ awards }: PlayerAwardsProps) {
  return (
    <Box className="player-awards-section">
      <Text className="data-label">Awards</Text>
      {awards.length === 0 ? (
        <Text className="page-summary">No awards in this scope.</Text>
      ) : (
        <Box className="player-awards-list">
          {awards.map((award) => {
            const metadata = awardMetadata[award.awardType] ?? {
              icon: Medal,
              label: readableAwardType(award.awardType),
              tone: "neutral" as const
            };
            const Icon = metadata.icon;
            const notes = award.notes?.trim();

            return (
              <Box className="player-award-row" data-tone={metadata.tone} key={award.id}>
                <Icon aria-hidden="true" className="player-award-icon" />
                <Box className="player-award-content">
                  <Text className="player-award-type">{metadata.label}</Text>
                  <Box className="player-award-context">
                    <Box>
                      <Text className="data-label">Event</Text>
                      <Text>{award.event.name}</Text>
                    </Box>
                    <Box>
                      <Text className="data-label">Award-time team</Text>
                      <Text>{award.team.name}</Text>
                    </Box>
                  </Box>
                  {notes ? <Text className="player-award-notes">{notes}</Text> : null}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
