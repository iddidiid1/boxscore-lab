import { StatSummaryPanel } from "../../../shared/components/data-display";

export type PlayerSummaryStat = {
  label: string;
  value: string;
};

type PlayerStatSummaryProps = {
  stats: PlayerSummaryStat[];
};

export function PlayerStatSummary({ stats }: PlayerStatSummaryProps) {
  return <StatSummaryPanel className="player-summary-card" stats={stats} title="Stat Summary" />;
}
