import { Anchor, Box, Button, Group, Stack, Text } from "@mantine/core";
import { MatchBoxScoreTable, MatchScoreHeader } from "./components";
import { mockMatchDetails } from "./mockMatchDetail";
import "./MatchDetailPage.css";

type MatchDetailPageProps = {
  matchId: string;
};

export function MatchDetailPage({ matchId }: MatchDetailPageProps) {
  const match = mockMatchDetails.find((matchDetail) => matchDetail.id === matchId) ?? mockMatchDetails[0];
  const homePlayers = match.players.filter((player) => player.teamId === match.homeTeam.id);
  const awayPlayers = match.players.filter((player) => player.teamId === match.awayTeam.id);

  return (
    <Stack className="match-detail-page" gap="md">
      <Group className="match-detail-actions" justify="space-between">
        <Anchor className="match-detail-back-link" href="/matches">
          {"\u2190 Back to Matches"}
        </Anchor>
        <Button className="edit-match-button" component="a" href={`/matches/${match.id}/edit`}>
          Edit Match
        </Button>
      </Group>

      <MatchScoreHeader match={match} />

      <Box className="match-box-score-grid">
        <MatchBoxScoreTable
          otherStats={match.otherStats[match.homeTeam.id]}
          players={homePlayers}
          teamColor={match.homeTeam.color}
          title={match.homeTeam.name}
        />
        <MatchBoxScoreTable
          otherStats={match.otherStats[match.awayTeam.id]}
          players={awayPlayers}
          teamColor={match.awayTeam.color}
          title={match.awayTeam.name}
        />
      </Box>

      {match.id !== matchId ? (
        <Text className="match-detail-fallback-note">
          Showing mock match data until this match record is connected.
        </Text>
      ) : null}
    </Stack>
  );
}
