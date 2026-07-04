import { Box, Button, Group, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";

export function MatchesPageHeader() {
  return (
    <Group align="flex-start" className="matches-header" justify="space-between">
      <Box>
        <Text className="eyebrow">Match records</Text>
        <Title className="page-title" order={1}>
          Matches
        </Title>
        <Text className="page-summary" maw={620} mt="xs">
          Review completed matches by team or event and keep a clear path ready for new
          match entry.
        </Text>
      </Box>

      <Button
        className="create-match-button app-action-button app-action-button--primary"
        component="a"
        href="/matches/new"
        leftSection={<Plus size={16} />}
      >
        Create Match
      </Button>
    </Group>
  );
}
