import { CompetitionsPage } from "../pages/CompetitionsPage";
import { HomePage } from "../pages/HomePage";
import { MatchesPage } from "../pages/MatchesPage";
import { PlayersPage } from "../pages/PlayersPage";
import { SeasonsPage } from "../pages/SeasonsPage";
import { StatsPage } from "../pages/StatsPage";
import { TeamsPage } from "../pages/TeamsPage";

export type PageKey =
  | "home"
  | "teams"
  | "players"
  | "seasons"
  | "competitions"
  | "matches"
  | "stats";

export const appPages: Array<{
  key: PageKey;
  label: string;
  Component: () => React.JSX.Element;
}> = [
  {
    key: "home",
    label: "Home",
    Component: HomePage
  },
  {
    key: "teams",
    label: "Teams",
    Component: TeamsPage
  },
  {
    key: "players",
    label: "Players",
    Component: PlayersPage
  },
  {
    key: "seasons",
    label: "Seasons",
    Component: SeasonsPage
  },
  {
    key: "competitions",
    label: "Competitions",
    Component: CompetitionsPage
  },
  {
    key: "matches",
    label: "Matches",
    Component: MatchesPage
  },
  {
    key: "stats",
    label: "Stats",
    Component: StatsPage
  }
];
