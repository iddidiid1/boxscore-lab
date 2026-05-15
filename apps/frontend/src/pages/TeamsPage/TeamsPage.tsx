import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { CreateTeamButton } from "./components/CreateTeamButton";
import { DivisionCard } from "./components/DivisionCard";
import type { Division, Team } from "./types";
import "./TeamsPage.css";

const divisions: Division[] = ["A", "B", "C", "D"];

const mockTeams: Team[] = [
  {
    id: "falcon-united",
    name: "Falcon United",
    division: "A",
    points: 1280,
    overallRating: 4
  },
  {
    id: "harbor-kings",
    name: "Harbor Kings",
    division: "A",
    points: 1215,
    overallRating: 5
  },
  {
    id: "metro-rangers",
    name: "Metro Rangers",
    division: "A",
    points: 1090,
    overallRating: 3
  },
  {
    id: "valley-strikers",
    name: "Valley Strikers",
    division: "A",
    points: 980,
    overallRating: 3
  },
  {
    id: "summit-athletic",
    name: "Summit Athletic",
    division: "B",
    points: 1335,
    overallRating: 5
  },
  {
    id: "northside-crew",
    name: "Northside Crew",
    division: "B",
    points: 1170,
    overallRating: 4
  },
  {
    id: "cedar-city",
    name: "Cedar City",
    division: "B",
    points: 1045,
    overallRating: 3
  },
  {
    id: "ironbridge-fc",
    name: "Ironbridge FC",
    division: "B",
    points: 1010,
    overallRating: 4
  },
  {
    id: "coastal-wolves",
    name: "Coastal Wolves",
    division: "C",
    points: 1255,
    overallRating: 4
  },
  {
    id: "redwood-town",
    name: "Redwood Town",
    division: "C",
    points: 1188,
    overallRating: 4
  },
  {
    id: "prairie-fc",
    name: "Prairie FC",
    division: "C",
    points: 1124,
    overallRating: 3
  },
  {
    id: "lakeside-rovers",
    name: "Lakeside Rovers",
    division: "C",
    points: 955,
    overallRating: 2
  },
  {
    id: "capital-guard",
    name: "Capital Guard",
    division: "D",
    points: 1302,
    overallRating: 5
  },
  {
    id: "eastbank-club",
    name: "Eastbank Club",
    division: "D",
    points: 1162,
    overallRating: 4
  },
  {
    id: "orchard-park",
    name: "Orchard Park",
    division: "D",
    points: 1078,
    overallRating: 3
  },
  {
    id: "silverline",
    name: "Silverline",
    division: "D",
    points: 990,
    overallRating: 2
  }
];

function getFirstLetter(name: string) {
  return name.trim().charAt(0).toLocaleUpperCase();
}

function getTeamsByDivision(division: Division) {
  return mockTeams
    .filter((team) => team.division === division)
    .sort((firstTeam, secondTeam) =>
      getFirstLetter(firstTeam.name).localeCompare(getFirstLetter(secondTeam.name))
    );
}

export function TeamsPage() {
  return (
    <Stack className="teams-page" gap="xl">
      <Group align="flex-start" className="teams-header" justify="space-between">
        <Box>
          <Text className="eyebrow">League overview</Text>
          <Title className="page-title" order={1}>
            Teams
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Manage all teams across divisions and compare current standing, points, and
            overall strength at a glance.
          </Text>
        </Box>

        <CreateTeamButton />
      </Group>

      <Box className="division-board">
        {divisions.map((division) => (
          <DivisionCard division={division} key={division} teams={getTeamsByDivision(division)} />
        ))}
      </Box>
    </Stack>
  );
}
