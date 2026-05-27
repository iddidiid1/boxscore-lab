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
      { id: "champion", label: "Champion", isWinnerTag: true },
      { id: "runner-up", label: "Runner-up", isWinnerTag: false },
      { id: "semifinalist", label: "Semifinalist", isWinnerTag: false },
      { id: "participant", label: "Participant", isWinnerTag: false }
    ],
    results: [
      {
        teamId: "falcon-united",
        teamName: "Falcon United",
        score: 360,
        resultTagId: "champion",
        notes: "Closed the final with the highest aggregate roster total."
      },
      {
        teamId: "capital-guard",
        teamName: "Capital Guard",
        score: 332,
        resultTagId: "runner-up",
        notes: "Reached the title match through a narrow semifinal win."
      },
      {
        teamId: "summit-athletic",
        teamName: "Summit Athletic",
        score: 304,
        resultTagId: "semifinalist",
        notes: "Strong group run before falling in the last four."
      },
      {
        teamId: "harbor-kings",
        teamName: "Harbor Kings",
        score: 298,
        resultTagId: "semifinalist",
        notes: "Pushed the eventual champion in the semifinal."
      },
      {
        teamId: "metro-rangers",
        teamName: "Metro Rangers",
        score: 244,
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
      { id: "leader", label: "Ladder Leader", isWinnerTag: true },
      { id: "contender", label: "Contender", isWinnerTag: false },
      { id: "participant", label: "Participant", isWinnerTag: false }
    ],
    results: [
      {
        teamId: "northside-crew",
        teamName: "Northside Crew",
        score: 214,
        resultTagId: "leader",
        notes: "Current leader while final fixtures remain open."
      },
      {
        teamId: "redwood-town",
        teamName: "Redwood Town",
        score: 206,
        resultTagId: "contender",
        notes: "Within striking distance entering the final review."
      },
      {
        teamId: "coastal-wolves",
        teamName: "Coastal Wolves",
        score: 198,
        resultTagId: "contender",
        notes: "Needs one result to move into the top settlement band."
      },
      {
        teamId: "prairie-fc",
        teamName: "Prairie FC",
        score: 172,
        resultTagId: "participant",
        notes: "Completed all posted fixtures."
      }
    ]
  },
  {
    id: "champions-showcase",
    name: "Champions Showcase",
    tier: "A",
    status: "not-started",
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
      { id: "champion", label: "Champion", isWinnerTag: true },
      { id: "runner-up", label: "Runner-up", isWinnerTag: false },
      { id: "semifinalist", label: "Semifinalist", isWinnerTag: false },
      { id: "participant", label: "Participant", isWinnerTag: false }
    ],
    results: [
      {
        teamId: "summit-athletic",
        teamName: "Summit Athletic",
        score: 0,
        resultTagId: "participant",
        notes: "Seeded entrant awaiting first match."
      },
      {
        teamId: "capital-guard",
        teamName: "Capital Guard",
        score: 0,
        resultTagId: "participant",
        notes: "Seeded entrant awaiting first match."
      },
      {
        teamId: "falcon-united",
        teamName: "Falcon United",
        score: 0,
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
      { id: "champion", label: "Champion", isWinnerTag: true },
      { id: "runner-up", label: "Runner-up", isWinnerTag: false },
      { id: "participant", label: "Participant", isWinnerTag: false }
    ],
    results: [
      {
        teamId: "harbor-kings",
        teamName: "Harbor Kings",
        score: 188,
        resultTagId: "champion",
        notes: "Won the opening title match."
      },
      {
        teamId: "capital-guard",
        teamName: "Capital Guard",
        score: 176,
        resultTagId: "runner-up",
        notes: "Reached the final on point differential."
      },
      {
        teamId: "prairie-fc",
        teamName: "Prairie FC",
        score: 144,
        resultTagId: "participant",
        notes: "Posted the strongest non-final pool score."
      }
    ]
  }
];
