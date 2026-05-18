import { Group, Select } from "@mantine/core";
import type { PlayerRankingEventId, PlayerRankingEventOption } from "../types";

type PlayerRankingFiltersProps = {
  eventOptions: PlayerRankingEventOption[];
  eventValue: PlayerRankingEventId;
  onEventChange: (value: PlayerRankingEventId) => void;
  onPositionChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  positionOptions: string[];
  positionValue: string;
  teamOptions: string[];
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
    <Group className="player-ranking-filters" gap="sm">
      <Select
        allowDeselect={false}
        aria-label="Event filter"
        classNames={{ input: "player-filter-input", label: "player-filter-label" }}
        data={eventOptions}
        label="Event"
        onChange={(value) => {
          if (value) {
            onEventChange(value as PlayerRankingEventId);
          }
        }}
        value={eventValue}
      />
      <Select
        allowDeselect={false}
        aria-label="Team filter"
        classNames={{ input: "player-filter-input", label: "player-filter-label" }}
        data={teamOptions}
        label="Team"
        onChange={(value) => onTeamChange(value ?? "All teams")}
        value={teamValue}
      />
      <Select
        allowDeselect={false}
        aria-label="Position filter"
        classNames={{ input: "player-filter-input", label: "player-filter-label" }}
        data={positionOptions}
        label="Position"
        onChange={(value) => onPositionChange(value ?? "All positions")}
        value={positionValue}
      />
    </Group>
  );
}
