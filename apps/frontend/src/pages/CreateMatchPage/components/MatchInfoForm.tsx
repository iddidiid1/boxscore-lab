import { Box, MultiSelect, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import type { MatchFormEvent, MatchFormTeam } from "../types";

type MatchInfoFormProps = {
  awayTeamId: string | null;
  eventId: string | null;
  eventOptions: MatchFormEvent[];
  homeTeamId: string | null;
  matchDate: string;
  selectedTags: string[];
  tagOptions: string[];
  teams: MatchFormTeam[];
  onAwayTeamChange: (teamId: string | null) => void;
  onEventChange: (eventId: string | null) => void;
  onHomeTeamChange: (teamId: string | null) => void;
  onMatchDateChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
};

export function MatchInfoForm({
  awayTeamId,
  eventId,
  eventOptions,
  homeTeamId,
  matchDate,
  selectedTags,
  tagOptions,
  teams,
  onAwayTeamChange,
  onEventChange,
  onHomeTeamChange,
  onMatchDateChange,
  onTagsChange
}: MatchInfoFormProps) {
  const eventSelectOptions = eventOptions.map((event) => ({
    label: event.name,
    value: event.id
  }));

  const homeTeamOptions = teams.map((team) => ({
    disabled: team.id === awayTeamId,
    label: team.name,
    value: team.id
  }));

  const awayTeamOptions = teams.map((team) => ({
    disabled: team.id === homeTeamId,
    label: team.name,
    value: team.id
  }));

  return (
    <Box className="match-form-section">
      <Title order={2}>Match Information</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <Select
          allowDeselect
          classNames={{ input: "match-form-input", label: "match-form-input-label" }}
          data={eventSelectOptions}
          label="Event"
          onChange={onEventChange}
          placeholder="Select event"
          required
          value={eventId}
        />
        <MultiSelect
          classNames={{ input: "match-form-input", label: "match-form-input-label" }}
          data={tagOptions}
          disabled={!eventId}
          label="Tags"
          onChange={onTagsChange}
          placeholder={eventId ? "Select tags" : "Select event first"}
          value={selectedTags}
        />
        <TextInput
          classNames={{ input: "match-form-input", label: "match-form-input-label" }}
          label="Match Date"
          onChange={(event) => {
            const value = event.currentTarget.value;
            onMatchDateChange(value);
          }}
          required
          type="date"
          value={matchDate}
        />
        <Select
          allowDeselect
          classNames={{ input: "match-form-input", label: "match-form-input-label" }}
          data={homeTeamOptions}
          label="Home Team"
          onChange={onHomeTeamChange}
          placeholder="Select home team"
          required
          value={homeTeamId}
        />
        <Select
          allowDeselect
          classNames={{ input: "match-form-input", label: "match-form-input-label" }}
          data={awayTeamOptions}
          label="Away Team"
          onChange={onAwayTeamChange}
          placeholder="Select away team"
          required
          value={awayTeamId}
        />
      </SimpleGrid>
    </Box>
  );
}
