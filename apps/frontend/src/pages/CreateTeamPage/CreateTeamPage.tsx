import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { PlayerManagementSection } from "../ManageTeamPage/components/PlayerManagementSection";
import {
  TeamEditorForm,
  type TeamEditorValues
} from "../ManageTeamPage/components/TeamEditorForm";
import "../ManageTeamPage/ManageTeamPage.css";

const defaultTeam: TeamEditorValues = {
  name: "",
  division: "Division A",
  logoUrl: "",
  overallRating: 0,
  description: "",
  profileRatings: {
    defense: 5,
    offense: 5,
    consistency: 5,
    cohesion: 5,
    depth: 5
  }
};

export function CreateTeamPage() {
  return (
    <Stack className="manage-team-page" gap="lg">
      <Group align="flex-start" className="manage-team-header" justify="space-between">
        <Box>
          <Text className="eyebrow">TEAM WORKSPACE</Text>
          <Title className="page-title" order={1}>
            Create Team
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Create a new team profile, ratings, and roster setup.
          </Text>
        </Box>

        <Group gap="sm">
          <Button
            className="manage-team-save-button"
            onClick={(event) => event.preventDefault()}
          >
            Create Team
          </Button>
          <Button className="manage-team-cancel-button" component="a" href="/teams" variant="outline">
            Cancel
          </Button>
        </Group>
      </Group>

      <TeamEditorForm initialValues={defaultTeam} />

      <PlayerManagementSection />
    </Stack>
  );
}
