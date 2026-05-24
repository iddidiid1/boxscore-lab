import {
  Calendar,
  Shield,
  Trophy,
  Users,
  type LucideIcon
} from "lucide-react";
import type { ComponentType } from "react";
import { EventsPage } from "../pages/EventsPage";
import { MatchesPage } from "../pages/MatchesPage";
import { PlayersPage } from "../pages/PlayersPage";
import { TeamsPage } from "../pages/TeamsPage";

export type PageKey = "teams" | "players" | "matches" | "events";

export const appPages: Array<{
  key: PageKey;
  label: string;
  description: string;
  signal: string;
  Icon: LucideIcon;
  Component: ComponentType;
}> = [
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
    key: "matches",
    label: "Matches",
    description: "Placeholder for match creation, scores, and player stats.",
    signal: "Source of truth",
    Icon: Calendar,
    Component: MatchesPage
  },
  {
    key: "events",
    label: "Events",
    description: "Placeholder for events and manually entered results.",
    signal: "Manual results",
    Icon: Trophy,
    Component: EventsPage
  }
];
