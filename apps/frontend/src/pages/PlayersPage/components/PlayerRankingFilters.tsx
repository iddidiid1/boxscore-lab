import { Group, Select } from "@mantine/core";
type PlayerRankingFiltersProps = {
  eventOptions: Array<{ label: string; value: string }>;
  eventValue: string;
  onEventChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  positionOptions: Array<string | { label: string; value: string }>;
  positionValue: string;
  teamOptions: Array<string | { label: string; value: string }>;
  teamValue: string;
};

export function PlayerRankingFilters({
  eventOptions,
  eventValue,
  onEventChange,
  onPositionChange,
  onTeamChange,
  positionOptions,
  positionValue,
  teamOptions,
  teamValue
}: PlayerRankingFiltersProps) {
  return (
    <Group className="player-ranking-filters app-panel" gap="sm">
      <Select
        allowDeselect={false}
        aria-label="Event filter"
        classNames={{ input: "player-filter-input app-control-input", label: "player-filter-label app-control-label" }}
        data={eventOptions}
        label="Event"
        onChange={(value) => {
          if (value) {
            onEventChange(value);
          }
        }}
        value={eventValue}
      />
      <Select
        allowDeselect={false}
        aria-label="Team filter"
        classNames={{ input: "player-filter-input app-control-input", label: "player-filter-label app-control-label" }}
        data={teamOptions}
        label="Team"
        onChange={(value) => onTeamChange(value ?? "All teams")}
        value={teamValue}
      />
      <Select
        allowDeselect={false}
        aria-label="Position filter"
        classNames={{ input: "player-filter-input app-control-input", label: "player-filter-label app-control-label" }}
        data={positionOptions}
        label="Position"
        onChange={(value) => onPositionChange(value ?? "All positions")}
        value={positionValue}
      />
    </Group>
  );
}
