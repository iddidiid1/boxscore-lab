import { Anchor, Box, Stack } from "@mantine/core";
import { RosterTable, type Player } from "./components/RosterTable";
import { TeamRadarCard, type TeamRadarAttribute } from "./components/TeamRadarCard";
import { TeamProfileSummary } from "./components/TeamProfileSummary";
import { TeamSummaryCard, type TeamSummaryStat } from "./components/TeamSummaryCard";
import "./TeamDetailPage.css";

const mockTeam = {
  name: "Falcon United",
  division: "Division A",
  points: 1280,
  overallRating: 4,
  description:
    "A fast-paced squad built around transition scoring, high-volume guard play, and disciplined half-court spacing."
};

const mockRadarAttributes: TeamRadarAttribute[] = [
  { label: "DEF", value: 8.5 },
  { label: "OFF", value: 8.0 },
  { label: "CON", value: 7.5 },
  { label: "COH", value: 7.0 },
  { label: "DEP", value: 8.8 }
];

const mockSummaryStats: TeamSummaryStat[] = [
  { label: "PTS", value: "112.4" },
  { label: "REB", value: "43.8" },
  { label: "AST", value: "26.1" },
  { label: "FG%", value: "48.6%" },
  { label: "3P%", value: "37.9%" }
];

const mockPlayers: Player[] = [
  {
    id: "mason-cole",
    number: 7,
    position: "G",
    name: "Mason Cole",
    points: 24.6,
    rebounds: 4.8,
    assists: 7.2,
    fieldGoalPercentage: 48.3,
    threePointPercentage: 39.1,
    averageMinutes: 33.8,
    starRating: 5
  },
  {
    id: "eli-brooks",
    number: 12,
    position: "F",
    name: "Eli Brooks",
    points: 18.9,
    rebounds: 8.1,
    assists: 3.6,
    fieldGoalPercentage: 51.7,
    threePointPercentage: 34.5,
    averageMinutes: 29.4,
    starRating: 4
  }
];

export function TeamDetailPage() {
  return (
    <Stack className="team-detail-page" gap="md">
      <Anchor className="team-detail-back-link" href="/teams">
        {"\u2190 Back to Teams"}
      </Anchor>

      <Box className="team-detail-hero">
        <TeamProfileSummary
          description={mockTeam.description}
          division={mockTeam.division}
          name={mockTeam.name}
          overallRating={mockTeam.overallRating}
          points={mockTeam.points}
        />
        <TeamRadarCard attributes={mockRadarAttributes} />
      </Box>

      <TeamSummaryCard stats={mockSummaryStats} />

      <RosterTable players={mockPlayers} />
    </Stack>
  );
}
