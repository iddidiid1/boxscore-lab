import type {
  PlayerRanking,
  PlayerRankingEventId,
  PlayerRankingEventOption,
  PlayerRankingStatLine,
  StatisticLeader
} from "./types";

export const mockEventOptions: PlayerRankingEventOption[] = [
  { label: "Season Total", value: "season-total" },
  { label: "Regional Finals", value: "regional-finals" },
  { label: "City Classic", value: "city-classic" }
];

export const mockStatisticLeaders: StatisticLeader[] = [
  {
    id: "points-per-game",
    accent: "points",
    label: "Points Per Game",
    value: "28.4",
    playerName: "Mason Hayes",
    teamName: "Harbor Kings"
  },
  {
    id: "assists-per-game",
    accent: "assists",
    label: "Assists Per Game",
    value: "9.3",
    playerName: "Owen Brooks",
    teamName: "Northside Crew"
  },
  {
    id: "rebounds-per-game",
    accent: "rebounds",
    label: "Rebounds Per Game",
    value: "12.6",
    playerName: "Isaac Wells",
    teamName: "Coastal Wolves"
  },
  {
    id: "player-rating",
    accent: "rating",
    label: "Player Rating",
    value: "9.6",
    playerName: "Mason Hayes",
    teamName: "Harbor Kings"
  }
];

export const mockPlayerEventStats: Record<
  PlayerRankingEventId,
  Record<string, PlayerRankingStatLine>
> = {
  "season-total": {
    "mason-hayes": {
      points: 28.4,
      assists: 8.7,
      rebounds: 4.2,
      fieldGoalPercentage: 51.6,
      threePointPercentage: 42.1,
      rating: 9.6
    },
    "eli-carter": {
      points: 26.9,
      assists: 5.4,
      rebounds: 7.8,
      fieldGoalPercentage: 48.9,
      threePointPercentage: 38.6,
      rating: 9.3
    },
    "noah-price": {
      points: 24.8,
      assists: 4.9,
      rebounds: 5.1,
      fieldGoalPercentage: 46.3,
      threePointPercentage: 40.4,
      rating: 9.0
    },
    "leo-bennett": {
      points: 22.5,
      assists: 3.6,
      rebounds: 10.2,
      fieldGoalPercentage: 53.8,
      threePointPercentage: 34.7,
      rating: 8.7
    },
    "isaac-wells": {
      points: 20.7,
      assists: 2.8,
      rebounds: 12.6,
      fieldGoalPercentage: 58.2,
      threePointPercentage: 27.5,
      rating: 8.4
    },
    "owen-brooks": {
      points: 19.9,
      assists: 9.3,
      rebounds: 3.8,
      fieldGoalPercentage: 44.7,
      threePointPercentage: 37.9,
      rating: 8.1
    },
    "caleb-stone": {
      points: 18.6,
      assists: 4.1,
      rebounds: 6.9,
      fieldGoalPercentage: 47.5,
      threePointPercentage: 36.2,
      rating: 7.8
    },
    "jonah-reed": {
      points: 17.8,
      assists: 3.9,
      rebounds: 4.6,
      fieldGoalPercentage: 45.2,
      threePointPercentage: 39.1,
      rating: 7.5
    },
    "wyatt-moore": {
      points: 16.9,
      assists: 3.2,
      rebounds: 8.4,
      fieldGoalPercentage: 49.8,
      threePointPercentage: 31.6,
      rating: 7.2
    },
    "asher-cole": {
      points: 15.7,
      assists: 2.5,
      rebounds: 9.7,
      fieldGoalPercentage: 55.1,
      threePointPercentage: 24.8,
      rating: 6.9
    },
    "lucas-miles": {
      points: 14.8,
      assists: 7.1,
      rebounds: 3.4,
      fieldGoalPercentage: 43.9,
      threePointPercentage: 35.5,
      rating: 6.6
    },
    "henry-cross": {
      points: 13.6,
      assists: 3.7,
      rebounds: 6.2,
      fieldGoalPercentage: 44.6,
      threePointPercentage: 33.8,
      rating: 6.3
    },
    "miles-foster": {
      points: 12.9,
      assists: 4.4,
      rebounds: 4.1,
      fieldGoalPercentage: 42.8,
      threePointPercentage: 36.9,
      rating: 6.0
    }
  },
  "regional-finals": {
    "mason-hayes": {
      points: 25.7,
      assists: 10.1,
      rebounds: 4.8,
      fieldGoalPercentage: 49.8,
      threePointPercentage: 39.5,
      rating: 9.1
    },
    "eli-carter": {
      points: 30.2,
      assists: 6.2,
      rebounds: 8.5,
      fieldGoalPercentage: 51.2,
      threePointPercentage: 41.0,
      rating: 9.8
    },
    "noah-price": {
      points: 22.4,
      assists: 5.7,
      rebounds: 4.9,
      fieldGoalPercentage: 44.2,
      threePointPercentage: 37.8,
      rating: 8.2
    },
    "leo-bennett": {
      points: 20.9,
      assists: 4.1,
      rebounds: 11.4,
      fieldGoalPercentage: 55.6,
      threePointPercentage: 32.6,
      rating: 8.8
    },
    "isaac-wells": {
      points: 18.1,
      assists: 3.4,
      rebounds: 14.2,
      fieldGoalPercentage: 60.4,
      threePointPercentage: 20.0,
      rating: 8.6
    },
    "owen-brooks": {
      points: 21.8,
      assists: 8.8,
      rebounds: 4.1,
      fieldGoalPercentage: 46.1,
      threePointPercentage: 40.3,
      rating: 8.5
    },
    "caleb-stone": {
      points: 17.9,
      assists: 4.6,
      rebounds: 7.5,
      fieldGoalPercentage: 48.8,
      threePointPercentage: 35.7,
      rating: 7.7
    },
    "jonah-reed": {
      points: 19.4,
      assists: 4.2,
      rebounds: 4.0,
      fieldGoalPercentage: 47.0,
      threePointPercentage: 42.4,
      rating: 7.9
    },
    "wyatt-moore": {
      points: 14.6,
      assists: 3.9,
      rebounds: 9.2,
      fieldGoalPercentage: 50.7,
      threePointPercentage: 28.9,
      rating: 7.0
    },
    "asher-cole": {
      points: 16.8,
      assists: 2.9,
      rebounds: 10.8,
      fieldGoalPercentage: 56.8,
      threePointPercentage: 22.1,
      rating: 7.3
    },
    "lucas-miles": {
      points: 13.7,
      assists: 7.9,
      rebounds: 3.1,
      fieldGoalPercentage: 42.4,
      threePointPercentage: 34.2,
      rating: 6.7
    },
    "henry-cross": {
      points: 12.1,
      assists: 3.2,
      rebounds: 5.8,
      fieldGoalPercentage: 41.6,
      threePointPercentage: 31.5,
      rating: 5.9
    },
    "miles-foster": {
      points: 15.2,
      assists: 4.7,
      rebounds: 4.5,
      fieldGoalPercentage: 43.5,
      threePointPercentage: 38.4,
      rating: 6.8
    }
  },
  "city-classic": {
    "mason-hayes": {
      points: 31.1,
      assists: 7.8,
      rebounds: 3.9,
      fieldGoalPercentage: 53.4,
      threePointPercentage: 44.8,
      rating: 9.7
    },
    "eli-carter": {
      points: 24.3,
      assists: 5.9,
      rebounds: 9.1,
      fieldGoalPercentage: 47.4,
      threePointPercentage: 36.3,
      rating: 8.9
    },
    "noah-price": {
      points: 27.6,
      assists: 4.2,
      rebounds: 5.6,
      fieldGoalPercentage: 48.1,
      threePointPercentage: 43.2,
      rating: 9.2
    },
    "leo-bennett": {
      points: 23.8,
      assists: 3.1,
      rebounds: 9.9,
      fieldGoalPercentage: 52.6,
      threePointPercentage: 36.9,
      rating: 8.5
    },
    "isaac-wells": {
      points: 19.6,
      assists: 2.2,
      rebounds: 11.7,
      fieldGoalPercentage: 57.5,
      threePointPercentage: 26.4,
      rating: 8.0
    },
    "owen-brooks": {
      points: 18.3,
      assists: 10.6,
      rebounds: 3.7,
      fieldGoalPercentage: 43.1,
      threePointPercentage: 36.6,
      rating: 8.3
    },
    "caleb-stone": {
      points: 20.1,
      assists: 3.8,
      rebounds: 6.5,
      fieldGoalPercentage: 46.7,
      threePointPercentage: 34.8,
      rating: 7.6
    },
    "jonah-reed": {
      points: 16.2,
      assists: 4.5,
      rebounds: 4.8,
      fieldGoalPercentage: 44.1,
      threePointPercentage: 37.3,
      rating: 7.1
    },
    "wyatt-moore": {
      points: 18.8,
      assists: 2.7,
      rebounds: 8.9,
      fieldGoalPercentage: 51.3,
      threePointPercentage: 33.2,
      rating: 7.4
    },
    "asher-cole": {
      points: 14.1,
      assists: 2.8,
      rebounds: 10.1,
      fieldGoalPercentage: 54.6,
      threePointPercentage: 25.7,
      rating: 6.6
    },
    "lucas-miles": {
      points: 16.5,
      assists: 6.8,
      rebounds: 3.6,
      fieldGoalPercentage: 45.7,
      threePointPercentage: 37.1,
      rating: 7.0
    },
    "henry-cross": {
      points: 11.8,
      assists: 4.3,
      rebounds: 6.8,
      fieldGoalPercentage: 43.2,
      threePointPercentage: 32.4,
      rating: 6.1
    },
    "miles-foster": {
      points: 13.4,
      assists: 5.1,
      rebounds: 4.4,
      fieldGoalPercentage: 41.6,
      threePointPercentage: 35.8,
      rating: 6.4
    }
  }
};

export const mockPlayerRankings: PlayerRanking[] = [
  {
    id: "mason-hayes",
    rank: 1,
    name: "Mason Hayes",
    team: "Harbor Kings",
    teamColor: "#3b82f6",
    position: "PG",
    points: 28.4,
    assists: 8.7,
    rebounds: 4.2,
    fieldGoalPercentage: 51.6,
    threePointPercentage: 42.1,
    rating: 9.6
  },
  {
    id: "eli-carter",
    rank: 2,
    name: "Eli Carter",
    team: "Summit Athletic",
    teamColor: "#4edea3",
    position: "SF",
    points: 26.9,
    assists: 5.4,
    rebounds: 7.8,
    fieldGoalPercentage: 48.9,
    threePointPercentage: 38.6,
    rating: 9.3
  },
  {
    id: "noah-price",
    rank: 3,
    name: "Noah Price",
    team: "Capital Guard",
    teamColor: "#f59e0b",
    position: "SG",
    points: 24.8,
    assists: 4.9,
    rebounds: 5.1,
    fieldGoalPercentage: 46.3,
    threePointPercentage: 40.4,
    rating: 9.0
  },
  {
    id: "leo-bennett",
    rank: 4,
    name: "Leo Bennett",
    team: "Falcon United",
    teamColor: "#ef4444",
    position: "PF",
    points: 22.5,
    assists: 3.6,
    rebounds: 10.2,
    fieldGoalPercentage: 53.8,
    threePointPercentage: 34.7,
    rating: 8.7
  },
  {
    id: "isaac-wells",
    rank: 5,
    name: "Isaac Wells",
    team: "Coastal Wolves",
    teamColor: "#06b6d4",
    position: "C",
    points: 20.7,
    assists: 2.8,
    rebounds: 12.6,
    fieldGoalPercentage: 58.2,
    threePointPercentage: 27.5,
    rating: 8.4
  },
  {
    id: "owen-brooks",
    rank: 6,
    name: "Owen Brooks",
    team: "Northside Crew",
    teamColor: "#a855f7",
    position: "PG",
    points: 19.9,
    assists: 9.3,
    rebounds: 3.8,
    fieldGoalPercentage: 44.7,
    threePointPercentage: 37.9,
    rating: 8.1
  },
  {
    id: "caleb-stone",
    rank: 7,
    name: "Caleb Stone",
    team: "Redwood Town",
    teamColor: "#22c55e",
    position: "SF",
    points: 18.6,
    assists: 4.1,
    rebounds: 6.9,
    fieldGoalPercentage: 47.5,
    threePointPercentage: 36.2,
    rating: 7.8
  },
  {
    id: "jonah-reed",
    rank: 8,
    name: "Jonah Reed",
    team: "Ironbridge FC",
    teamColor: "#f97316",
    position: "SG",
    points: 17.8,
    assists: 3.9,
    rebounds: 4.6,
    fieldGoalPercentage: 45.2,
    threePointPercentage: 39.1,
    rating: 7.5
  },
  {
    id: "wyatt-moore",
    rank: 9,
    name: "Wyatt Moore",
    team: "Metro Rangers",
    teamColor: "#6366f1",
    position: "PF",
    points: 16.9,
    assists: 3.2,
    rebounds: 8.4,
    fieldGoalPercentage: 49.8,
    threePointPercentage: 31.6,
    rating: 7.2
  },
  {
    id: "asher-cole",
    rank: 10,
    name: "Asher Cole",
    team: "Prairie FC",
    teamColor: "#84cc16",
    position: "C",
    points: 15.7,
    assists: 2.5,
    rebounds: 9.7,
    fieldGoalPercentage: 55.1,
    threePointPercentage: 24.8,
    rating: 6.9
  },
  {
    id: "lucas-miles",
    rank: 11,
    name: "Lucas Miles",
    team: "Eastbank Club",
    teamColor: "#14b8a6",
    position: "PG",
    points: 14.8,
    assists: 7.1,
    rebounds: 3.4,
    fieldGoalPercentage: 43.9,
    threePointPercentage: 35.5,
    rating: 6.6
  },
  {
    id: "henry-cross",
    rank: 12,
    name: "Henry Cross",
    team: "Cedar City",
    teamColor: "#64748b",
    position: "SF",
    points: 13.6,
    assists: 3.7,
    rebounds: 6.2,
    fieldGoalPercentage: 44.6,
    threePointPercentage: 33.8,
    rating: 6.3
  },
  {
    id: "miles-foster",
    rank: 13,
    name: "Miles Foster",
    team: "Lakeside Rovers",
    teamColor: "#0ea5e9",
    position: "SG",
    points: 12.9,
    assists: 4.4,
    rebounds: 4.1,
    fieldGoalPercentage: 42.8,
    threePointPercentage: 36.9,
    rating: 6.0
  }
];
