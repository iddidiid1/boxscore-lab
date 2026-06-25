import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { Shield } from "lucide-react";

type TeamProfileSummaryProps = {
  name: string;
  logoUrl?: string;
  division: string;
  points: number;
  overallRating: number;
  description: string;
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
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating / 2)));
  return `${"\u2605".repeat(roundedRating)}${"\u2606".repeat(5 - roundedRating)}`;
}

export function TeamProfileSummary({
  name,
  logoUrl,
  division,
  points,
  overallRating,
  description
}: TeamProfileSummaryProps) {
  return (
    <Stack className="team-profile-summary" gap="md">
      <Group align="center" gap="lg" wrap="nowrap">
        {logoUrl ? (
          <img alt="" className="team-profile-logo" src={logoUrl} />
        ) : (
          <Box aria-hidden="true" className="team-profile-logo team-profile-logo-fallback">
            <Shield size={28} />
            <span>{getInitials(name)}</span>
          </Box>
        )}

        <Stack className="team-profile-content" gap={4}>
          <Title order={1}>{name}</Title>
          <Text className="team-profile-division">{division}</Text>
          <Text className="team-profile-points">{points.toLocaleString()} pts</Text>
          <Text aria-label={`${overallRating} out of 5 rating`} className="team-profile-rating">
            {getStars(overallRating)}
          </Text>
        </Stack>
      </Group>

      <Text className="team-profile-description">{description}</Text>
    </Stack>
  );
}
