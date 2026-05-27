import type { EventSummary } from "../types";

export const mockEvents: EventSummary[] = [
  {
    id: "winter-cup-finals",
    name: "Winter Cup Finals",
    tier: "S",
    status: "completed",
    description:
      "Top seeded teams from each division meet in a single-elimination cup. Tied finals are settled by aggregate fantasy points from the full match roster. Testing TestingTestingTestingTestingTestingTestingTestingTestingTestingTesting",
    participatingTeamCount: 8,
    winnerName: "Falcon United",
    stageTags: [
      {
        id: "group-stage",
        label: "Group Stage",
        description: "Opening matches used to seed the knockout bracket."
      },
      {
        id: "semifinal",
        label: "Semifinal",
        description: "Two elimination matches decide the finalists."
      },
      {
        id: "final",
        label: "Final",
        description: "Winner-takes-title championship match."
      }
    ],
    resultTags: [
      { id: "champion", label: "Champion", isWinnerTag: true, rankingPoints: 10 },
      { id: "runner-up", label: "Runner-up", isWinnerTag: false, rankingPoints: 7 },
      { id: "semifinalist", label: "Semifinalist", isWinnerTag: false, rankingPoints: 3 },
      { id: "participant", label: "Participant", isWinnerTag: false, rankingPoints: 0 }
    ],
    results: [
      {
        teamId: "falcon-united",
        teamName: "Falcon United",
        resultTagId: "champion",
        notes: "Closed the final with the highest aggregate roster total."
      },
      {
        teamId: "capital-guard",
        teamName: "Capital Guard",
        resultTagId: "runner-up",
        notes: "Reached the title match through a narrow semifinal win."
      },
      {
        teamId: "summit-athletic",
        teamName: "Summit Athletic",
        resultTagId: "semifinalist",
        notes: "Strong group run before falling in the last four."
      },
      {
        teamId: "harbor-kings",
        teamName: "Harbor Kings",
        resultTagId: "semifinalist",
        notes: "Pushed the eventual champion in the semifinal."
      },
      {
        teamId: "metro-rangers",
        teamName: "Metro Rangers",
        resultTagId: "participant",
        notes: "Eliminated after group-stage tiebreakers."
      }
    ]
  },
  {
    id: "may-ladder-round",
    name: "May Ladder Round",
    tier: "B",
    status: "ongoing",
    description:
      "A rolling league round where every team logs scheduled fixtures and table movement is reviewed after the final submitted score.",
    participatingTeamCount: 16,
    stageTags: [
      {
        id: "group-stage",
        label: "Group Stage",
        description: "Round fixtures tracked as the ladder develops."
      },
      {
        id: "final-review",
        label: "Final Review",
        description: "Manual settlement window after all scores are submitted."
      }
    ],
    resultTags: [
      { id: "leader", label: "Ladder Leader", isWinnerTag: true, rankingPoints: 8 },
      { id: "contender", label: "Contender", isWinnerTag: false, rankingPoints: 4 },
      { id: "participant", label: "Participant", isWinnerTag: false, rankingPoints: 0 }
    ],
    results: [
      {
        teamId: "northside-crew",
        teamName: "Northside Crew",
        resultTagId: "leader",
        notes: "Current leader while final fixtures remain open."
      },
      {
        teamId: "redwood-town",
        teamName: "Redwood Town",
        resultTagId: "contender",
        notes: "Within striking distance entering the final review."
      },
      {
        teamId: "coastal-wolves",
        teamName: "Coastal Wolves",
        resultTagId: "contender",
        notes: "Needs one result to move into the top settlement band."
      },
      {
        teamId: "prairie-fc",
        teamName: "Prairie FC",
        resultTagId: "participant",
        notes: "Completed all posted fixtures."
      }
    ]
  },
  {
    id: "champions-showcase",
    name: "Champions Showcase",
    tier: "A",
    status: "preparing",
    description:
      "Invitational event reserved for division leaders, with opening pairings seeded by current rating and manual score entry after each fixture.",
    participatingTeamCount: 6,
    stageTags: [
      {
        id: "quarterfinal",
        label: "Quarterfinal",
        description: "Opening knockout round for lower seeds."
      },
      {
        id: "semifinal",
        label: "Semifinal",
        description: "Top seeds enter the bracket."
      },
      {
        id: "final",
        label: "Final",
        description: "Championship fixture for the showcase title."
      }
    ],
    resultTags: [
      { id: "champion", label: "Champion", isWinnerTag: true, rankingPoints: 10 },
      { id: "runner-up", label: "Runner-up", isWinnerTag: false, rankingPoints: 7 },
      { id: "semifinalist", label: "Semifinalist", isWinnerTag: false, rankingPoints: 3 },
      { id: "participant", label: "Participant", isWinnerTag: false, rankingPoints: 0 }
    ],
    results: [
      {
        teamId: "summit-athletic",
        teamName: "Summit Athletic",
        resultTagId: "participant",
        notes: "Seeded entrant awaiting first match."
      },
      {
        teamId: "capital-guard",
        teamName: "Capital Guard",
        resultTagId: "participant",
        notes: "Seeded entrant awaiting first match."
      },
      {
        teamId: "falcon-united",
        teamName: "Falcon United",
        resultTagId: "participant",
        notes: "Seeded entrant awaiting first match."
      }
    ]
  },
  {
    id: "opening-showcase",
    name: "Opening Showcase",
    tier: "C",
    status: "completed",
    description:
      "Short-form kickoff tournament used to validate rosters, scoring rules, and early-season balance before the main ladder begins.",
    participatingTeamCount: 12,
    winnerName: "Harbor Kings",
    stageTags: [
      {
        id: "group-stage",
        label: "Group Stage",
        description: "Three small pools determine the title fixture."
      },
      {
        id: "final",
        label: "Final",
        description: "Best two teams by event points meet for first place."
      }
    ],
    resultTags: [
      { id: "champion", label: "Champion", isWinnerTag: true, rankingPoints: 10 },
      { id: "runner-up", label: "Runner-up", isWinnerTag: false, rankingPoints: 7 },
      { id: "participant", label: "Participant", isWinnerTag: false, rankingPoints: 0 }
    ],
    results: [
      {
        teamId: "harbor-kings",
        teamName: "Harbor Kings",
        resultTagId: "champion",
        notes: "Won the opening title match."
      },
      {
        teamId: "capital-guard",
        teamName: "Capital Guard",
        resultTagId: "runner-up",
        notes: "Reached the final on point differential."
      },
      {
        teamId: "prairie-fc",
        teamName: "Prairie FC",
        resultTagId: "participant",
        notes: "Posted the strongest non-final pool score."
      }
    ]
  }
];
