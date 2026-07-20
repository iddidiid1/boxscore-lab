import { Group, Stack, Text, Title } from "@mantine/core";
import { FractionalStarRating } from "../../../shared/components/data-display";
import { TeamArtwork } from "../../../shared/components/team-identity";

type TeamProfileSummaryProps = {
  name: string;
  logoUrl?: string;
  division: string;
  points: number;
  overallRating: number | null;
  description: string;
};

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
        <TeamArtwork
          className="team-profile-logo"
          logoUrl={logoUrl}
          name={name}
          size="detail"
        />

        <Stack className="team-profile-content" gap={4}>
          <Title order={1}>{name}</Title>
          <Text className="team-profile-division">{division}</Text>
          <Text className="team-profile-points">{points.toLocaleString()} pts</Text>
          <FractionalStarRating className="team-profile-rating" value={overallRating} />
        </Stack>
      </Group>

      <Text className="team-profile-description">{description}</Text>
    </Stack>
  );
}
