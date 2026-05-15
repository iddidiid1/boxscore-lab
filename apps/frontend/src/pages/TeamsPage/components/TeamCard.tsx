import { Anchor, Box, Group, Text } from "@mantine/core";
import { Shield } from "lucide-react";
import type { Team } from "../types";

type TeamCardProps = {
  team: Team;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getStars(rating: number) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"\u2605".repeat(roundedRating)}${"\u2606".repeat(5 - roundedRating)}`;
}

function TeamLogo({ team }: { team: Team }) {
  if (team.logoUrl) {
    return <img alt="" className="team-logo" src={team.logoUrl} />;
  }

  return (
    <Box aria-hidden="true" className="team-logo team-logo-fallback">
      <Shield size={18} />
      <span>{getInitials(team.name)}</span>
    </Box>
  );
}

export function TeamCard({ team }: TeamCardProps) {
  const teamDetailPath = `/teams/${team.id}`;

  return (
    <Box className="team-card">
      <Anchor
        aria-label={`View ${team.name} details`}
        className="team-logo-link"
        href={teamDetailPath}
      >
        <TeamLogo team={team} />
      </Anchor>
      <Box className="team-card-main">
        <Anchor className="team-name-link" href={teamDetailPath}>
          <Text className="team-name">{team.name}</Text>
        </Anchor>
        <Group gap="xs" justify="space-between" wrap="nowrap">
          <Text className="team-points">{team.points.toLocaleString()} pts</Text>
          <Text aria-label={`${team.overallRating} out of 5 rating`} className="team-rating">
            {getStars(team.overallRating)}
          </Text>
        </Group>
      </Box>
    </Box>
  );
}
