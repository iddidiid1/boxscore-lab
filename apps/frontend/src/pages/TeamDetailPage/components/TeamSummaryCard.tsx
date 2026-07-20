import { StatSummaryPanel } from "../../../shared/components/data-display";

export type TeamSummaryStat = {
  label: string;
  value: string;
};

type TeamSummaryCardProps = {
  stats: TeamSummaryStat[];
};

export function TeamSummaryCard({ stats }: TeamSummaryCardProps) {
  return <StatSummaryPanel className="team-summary-card" stats={stats} title="Team Summary" />;
}
