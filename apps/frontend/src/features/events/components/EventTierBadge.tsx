import { Box, Text } from "@mantine/core";
import type { EventTier } from "../types";
import "./EventTierBadge.css";

type EventTierBadgeProps = {
  size?: "compact" | "detail";
  tier: EventTier;
};

const tierSubtitles: Record<EventTier, string> = {
  S: "ELITE",
  A: "PREMIER",
  B: "CHALLENGER",
  C: "OPEN"
};

export function EventTierBadge({ size = "compact", tier }: EventTierBadgeProps) {
  return (
    <Box
      aria-label={`Tier ${tier}, ${tierSubtitles[tier]}`}
      className="event-tier-insignia"
      data-size={size}
      data-tier={tier}
    >
      <Box aria-hidden="true" className="event-tier-rail event-tier-rail--top" />
      <Box aria-hidden="true" className="event-tier-medallion">
        <Box className="event-tier-facet">
          <Text className="event-tier-letter">{tier}</Text>
        </Box>
      </Box>
      <Text aria-hidden="true" className="event-tier-label">{tierSubtitles[tier]}</Text>
      <Box aria-hidden="true" className="event-tier-rail event-tier-rail--bottom" />
    </Box>
  );
}
