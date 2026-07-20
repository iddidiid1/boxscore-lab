import { Shield } from "lucide-react";
import { FractionalStarRating } from "../../../shared/components/data-display";
import type { Team } from "../types";

type TeamCardProps = {
  team: Team;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function TeamLogo({ team }: { team: Team }) {
  if (team.logoUrl) {
    return <img alt="" className="team-logo" src={team.logoUrl} />;
  }

  const bg = team.primaryColor ?? "#232323";
  const isDark =
    !team.primaryColor ||
    parseInt(team.primaryColor.slice(1, 3), 16) * 0.299 +
      parseInt(team.primaryColor.slice(3, 5), 16) * 0.587 +
      parseInt(team.primaryColor.slice(5, 7), 16) * 0.114 <
      128;

  return (
    <div
      aria-hidden="true"
      className="team-logo team-logo-fallback"
      style={{ background: bg, color: isDark ? "#ffffff" : "#000000" }}
    >
      <Shield size={17} />
      <span>{getInitials(team.name)}</span>
    </div>
  );
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <a
      aria-label={`View ${team.name} details`}
      className="team-card"
      href={`/teams/${team.slug}`}
    >
      <TeamLogo team={team} />
      <div className="team-info">
        <div className="team-name">{team.name}</div>
        <div className="team-footer">
          <span className="team-pts">{team.totalPoints.toLocaleString()} pts</span>
          <FractionalStarRating
            className="team-stars"
            size="compact"
            value={team.overallRating}
          />
        </div>
      </div>
    </a>
  );
}
