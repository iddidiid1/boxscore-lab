import type { CSSProperties } from "react";
import { FractionalStarRating } from "../../../shared/components/data-display";
import { TeamArtwork } from "../../../shared/components/team-identity";
import type { Team } from "../types";

type TeamCardProps = {
  team: Team;
};

function getTeamTrace(primaryColor: string | null) {
  return primaryColor && /^#[\da-f]{6}$/i.test(primaryColor)
    ? primaryColor
    : "var(--color-team-trace-neutral)";
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <a
      aria-label={`View ${team.name} details`}
      className="team-card app-surface app-surface--identity"
      href={`/teams/${team.slug}`}
      style={{ "--team-trace": getTeamTrace(team.primaryColor) } as CSSProperties}
    >
      <div className="team-card-identity">
        <TeamArtwork logoUrl={team.logoUrl} name={team.name} />
        <div className="team-name">{team.name}</div>
        <div className="team-points">
          <span className="team-points-label">PTS</span>
          <strong>{team.totalPoints.toLocaleString()}</strong>
        </div>
      </div>
      <div className="team-rating-ledger">
        <span className="team-rating-label">Overall rating</span>
        <FractionalStarRating
          className="team-stars"
          size="compact"
          value={team.overallRating}
        />
      </div>
    </a>
  );
}
