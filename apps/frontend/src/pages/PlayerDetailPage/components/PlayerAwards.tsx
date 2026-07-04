import { Box, Text } from "@mantine/core";

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

export function PlayerAwards({ awards }: PlayerAwardsProps) {
  return (
    <Box className="player-awards-section">
      <Text className="data-label">Awards</Text>
      {awards.length === 0 ? (
        <Text className="page-summary">No awards in this scope.</Text>
      ) : (
        <Box className="player-awards-list">
          {awards.map((award) => (
            <Box className="player-award-row" key={award.id}>
              <Text className="player-award-type">
                {award.awardType.replace(/_/g, " ")}
              </Text>
              <Text className="player-award-context">
                {award.event.name} · {award.team.name}
              </Text>
              {award.notes && (
                <Text className="player-award-notes">{award.notes}</Text>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
