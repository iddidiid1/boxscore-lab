import { Group, Select } from "@mantine/core";

type Option = { id: number; name: string };
type Props = {
  events: Option[];
  teams: Option[];
  stageTags: Array<{ id: number; label: string }>;
  eventId?: number;
  teamId?: number;
  stageTagId?: number;
  onEventChange: (value?: number) => void;
  onTeamChange: (value?: number) => void;
  onStageTagChange: (value?: number) => void;
};

const value = (id?: number) => id ? String(id) : null;
const id = (next: string | null) => next ? Number(next) : undefined;

export function MatchFilters({ events, teams, stageTags, eventId, teamId, stageTagId, onEventChange, onTeamChange, onStageTagChange }: Props) {
  return (
    <Group className="match-filters app-panel" gap="sm">
      <Select aria-label="Team filter" clearable classNames={{ input: "match-filter-input", label: "match-filter-label" }} data={teams.map((item) => ({ value: String(item.id), label: item.name }))} label="Team" onChange={(next) => onTeamChange(id(next))} placeholder="All Teams" value={value(teamId)} />
      <Select aria-label="Event filter" clearable classNames={{ input: "match-filter-input", label: "match-filter-label" }} data={events.map((item) => ({ value: String(item.id), label: item.name }))} label="Event" onChange={(next) => onEventChange(id(next))} placeholder="All Events" value={value(eventId)} />
      <Select aria-label="Stage tag filter" clearable classNames={{ input: "match-filter-input", label: "match-filter-label" }} data={stageTags.map((item) => ({ value: String(item.id), label: item.label }))} disabled={!eventId} label="Stage" onChange={(next) => onStageTagChange(id(next))} placeholder="All Stages" value={value(stageTagId)} />
    </Group>
  );
}
