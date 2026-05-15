import {
  BarChart3,
  Calendar,
  Home,
  Shield,
  Swords,
  Trophy,
  Users,
  type LucideIcon
} from "lucide-react";
import type { ComponentType } from "react";
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
  description: string;
  signal: string;
  Icon: LucideIcon;
  Component: ComponentType;
}> = [
  {
    key: "home",
    label: "Home",
    description: "MVP overview for the local fantasy league statistics app.",
    signal: "System baseline",
    Icon: Home,
    Component: HomePage
  },
  {
    key: "teams",
    label: "Teams",
    description: "League overview board for team divisions and rankings.",
    signal: "Division board",
    Icon: Shield,
    Component: TeamsPage
  },
  {
    key: "players",
    label: "Players",
    description: "Placeholder for player profiles linked to teams.",
    signal: "Performance source",
    Icon: Users,
    Component: PlayersPage
  },
  {
    key: "seasons",
    label: "Seasons",
    description: "Placeholder for season management.",
    signal: "Competition timeline",
    Icon: Calendar,
    Component: SeasonsPage
  },
  {
    key: "competitions",
    label: "Competitions",
    description: "Placeholder for competitions and manually entered results.",
    signal: "Manual results",
    Icon: Trophy,
    Component: CompetitionsPage
  },
  {
    key: "matches",
    label: "Matches",
    description: "Placeholder for match creation, scores, and player stats.",
    signal: "Source of truth",
    Icon: Swords,
    Component: MatchesPage
  },
  {
    key: "stats",
    label: "Stats",
    description: "Placeholder for derived player and team statistics.",
    signal: "Derived analytics",
    Icon: BarChart3,
    Component: StatsPage
  }
];
