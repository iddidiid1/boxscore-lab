import { Group, Select } from "@mantine/core";

type MatchFiltersProps = {
  allEventsValue: string;
  allTagsValue: string;
  allTeamsValue: string;
  eventOptions: string[];
  eventValue: string;
  isTagFilterDisabled: boolean;
  onEventChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  tagOptions: string[];
  tagValue: string;
  teamOptions: string[];
  teamValue: string;
};

export function MatchFilters({
  allEventsValue,
  allTagsValue,
  allTeamsValue,
  eventOptions,
  eventValue,
  isTagFilterDisabled,
  onEventChange,
  onTagChange,
  onTeamChange,
  tagOptions,
  tagValue,
  teamOptions,
  teamValue
}: MatchFiltersProps) {
  return (
    <Group className="match-filters" gap="sm">
      <Select
        allowDeselect={false}
        aria-label="Team filter"
        classNames={{ input: "match-filter-input", label: "match-filter-label" }}
        data={teamOptions}
        label="Team"
        onChange={(value) => onTeamChange(value ?? allTeamsValue)}
        value={teamValue}
      />
      <Select
        allowDeselect={false}
        aria-label="Event filter"
        classNames={{ input: "match-filter-input", label: "match-filter-label" }}
        data={eventOptions}
        label="Event"
        onChange={(value) => onEventChange(value ?? allEventsValue)}
        value={eventValue}
      />
      <Select
        allowDeselect={false}
        aria-label="Tag filter"
        classNames={{ input: "match-filter-input", label: "match-filter-label" }}
        data={tagOptions}
        disabled={isTagFilterDisabled}
        label="Tag"
        onChange={(value) => onTagChange(value ?? allTagsValue)}
        value={tagValue}
      />
    </Group>
  );
}
