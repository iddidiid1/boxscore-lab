import { MatchFormPage } from "../CreateMatchPage";
export function EditMatchPage({ matchId }: { matchId: string }) {
  const id = Number(matchId);
  return <MatchFormPage cancelHref={`/matches/${id}`} description="Update match information and box score stats." matchId={id} mode="edit" title="Edit Match" />;
}
