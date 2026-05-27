import { Box, Text } from "@mantine/core";
import type { EventTier } from "../types";
import "./EventTierBadge.css";

type EventTierBadgeProps = {
  tier: EventTier;
};

const tierSubtitles: Record<EventTier, string> = {
  S: "ELITE",
  A: "PREMIER",
  B: "CHALLENGER",
  C: "OPEN"
};

export function EventTierBadge({ tier }: EventTierBadgeProps) {
  return (
    <Box aria-label={`${tierSubtitles[tier]} tier`} className="event-tier-crest" data-tier={tier}>
      <Text aria-hidden="true" className="event-tier-letter">
        {tier}
      </Text>
      <Text aria-hidden="true" className="event-tier-label">
        {tierSubtitles[tier]}
      </Text>
    </Box>
  );
}
