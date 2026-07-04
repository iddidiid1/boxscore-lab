import { TeamCard } from "./TeamCard";
import type { Division, Team } from "../types";

type DivisionCardProps = {
  division: Division;
  teams: Team[];
};

export function DivisionCard({ division, teams }: DivisionCardProps) {
  return (
    <div className="division-block">
      <div className="division-header">
        <span className="division-name">{division.divisionName}</span>
        <div className="division-rule" aria-hidden="true" />
      </div>

      <div className="team-grid">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
