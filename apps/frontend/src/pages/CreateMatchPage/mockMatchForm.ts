import type { MatchFormEvent, MatchFormTeam } from "./types";

export const mockMatchFormEvents: MatchFormEvent[] = [
  {
    id: "winter-cup-finals",
    name: "Winter Cup Finals",
    tags: ["Knockout", "Semi Final", "Final"]
  },
  {
    id: "may-ladder-round",
    name: "May Ladder Round",
    tags: ["Group Stage"]
  },
  {
    id: "autumn-invitational",
    name: "Autumn Invitational",
    tags: ["Group Stage", "Knockout", "Final"]
  },
  {
    id: "opening-showcase",
    name: "Opening Showcase",
    tags: ["Group Stage", "Final"]
  }
];

export const mockMatchFormTeams: MatchFormTeam[] = [
  {
    id: "falcon-united",
    name: "Falcon United",
    color: "#3b82f6",
    players: [
      { id: "mason-cole", position: "G", name: "Mason Cole" },
      { id: "eli-brooks", position: "F", name: "Eli Brooks" },
      { id: "noah-kent", position: "C", name: "Noah Kent" },
      { id: "owen-price", position: "PG", name: "Owen Price" },
      { id: "liam-west", position: "SF", name: "Liam West" },
      { id: "caleb-stone", position: "SG", name: "Caleb Stone" }
    ]
  },
  {
    id: "harbor-kings",
    name: "Harbor Kings",
    color: "#f97316",
    players: [
      { id: "asher-finn", position: "G", name: "Asher Finn" },
      { id: "leo-martin", position: "F", name: "Leo Martin" },
      { id: "kai-rivers", position: "PG", name: "Kai Rivers" },
      { id: "theo-hayes", position: "C", name: "Theo Hayes" },
      { id: "jude-ellis", position: "SG", name: "Jude Ellis" },
      { id: "max-bryant", position: "PF", name: "Max Bryant" }
    ]
  },
  {
    id: "summit-athletic",
    name: "Summit Athletic",
    color: "#22c55e",
    players: [
      { id: "isaac-hale", position: "PG", name: "Isaac Hale" },
      { id: "miles-turner", position: "SG", name: "Miles Turner" },
      { id: "ethan-cross", position: "F", name: "Ethan Cross" },
      { id: "lucas-gray", position: "PF", name: "Lucas Gray" },
      { id: "samuel-fox", position: "C", name: "Samuel Fox" }
    ]
  },
  {
    id: "capital-guard",
    name: "Capital Guard",
    color: "#eab308",
    players: [
      { id: "logan-wade", position: "PG", name: "Logan Wade" },
      { id: "henry-quinn", position: "G", name: "Henry Quinn" },
      { id: "james-knox", position: "SF", name: "James Knox" },
      { id: "aaron-shaw", position: "PF", name: "Aaron Shaw" },
      { id: "ryan-moss", position: "C", name: "Ryan Moss" }
    ]
  }
];
