import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { PlayerManagementSection } from "./components/PlayerManagementSection";
import { TeamEditorForm, type TeamEditorValues } from "./components/TeamEditorForm";
import "./ManageTeamPage.css";

const mockTeam: TeamEditorValues = {
  name: "Falcon United",
  division: "Division A",
  logoUrl: "",
  primaryColor: "#3B82F6",
  overallRating: 4,
  description:
    "A fast-paced squad built around transition scoring and disciplined half-court spacing.",
  profileRatings: {
    defense: 8.5,
    offense: 8,
    consistency: 7.5,
    cohesion: 7,
    depth: 8.8
  }
};

export function ManageTeamPage() {
  return (
    <Stack className="manage-team-page" gap="lg">
      <Group align="flex-start" className="manage-team-header" justify="space-between">
        <Box>
          <Text className="eyebrow">Team workspace</Text>
          <Title className="page-title" order={1}>
            Manage Team
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Update team identity, ratings, and roster settings.
          </Text>
        </Box>

        <Group gap="sm">
          <Button className="manage-team-save-button">Save Changes</Button>
          <Button
            className="manage-team-cancel-button"
            component="a"
            href="/teams/falcon-united"
            variant="outline"
          >
            Cancel
          </Button>
        </Group>
      </Group>

      <TeamEditorForm initialValues={mockTeam} />

      <PlayerManagementSection />
    </Stack>
  );
}
