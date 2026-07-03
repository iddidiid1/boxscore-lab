import { Box, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import type { MatchFormEventOption } from "../../../features/matches";
import type { MatchFormTeam } from "../types";

type Props = {
  mode: "create" | "edit"; eventId: number | null; events: MatchFormEventOption[]; stageTagId: number | null; stageTags: Array<{ id: number; label: string }>;
  playedAt: string; homeTeamId: number | null; awayTeamId: number | null; teams: MatchFormTeam[];
  onEventChange: (id: number | null) => void; onStageChange: (id: number | null) => void; onPlayedAtChange: (value: string) => void; onHomeChange: (id: number | null) => void; onAwayChange: (id: number | null) => void;
};
const asId = (value: string | null) => value ? Number(value) : null;
export function MatchInfoForm(props: Props) {
  const data = props.teams.map((team) => ({ value: String(team.id), label: `${team.name}${team.archivedAt ? " (Archived)" : ""}` }));
  return <Box className="match-form-section app-panel"><Title order={2}>Match Information</Title><SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
    <Select classNames={{ input: "match-form-input app-control-input", label: "match-form-input-label app-control-label" }} data={props.events.map((event) => ({ value: String(event.id), label: event.name }))} disabled={props.mode === "edit"} label="Event" onChange={(value) => props.onEventChange(asId(value))} required value={props.eventId ? String(props.eventId) : null} />
    <Select clearable classNames={{ input: "match-form-input app-control-input", label: "match-form-input-label app-control-label" }} data={props.stageTags.map((tag) => ({ value: String(tag.id), label: tag.label }))} label="Stage" onChange={(value) => props.onStageChange(asId(value))} value={props.stageTagId ? String(props.stageTagId) : null} />
    <TextInput classNames={{ input: "match-form-input app-control-input", label: "match-form-input-label app-control-label" }} label="Match Date & Time" max={new Date().toISOString().slice(0, 16)} onChange={(event) => props.onPlayedAtChange(event.currentTarget.value)} required type="datetime-local" value={props.playedAt} />
    <Select classNames={{ input: "match-form-input app-control-input", label: "match-form-input-label app-control-label" }} data={data.map((item) => ({ ...item, disabled: Number(item.value) === props.awayTeamId }))} disabled={props.mode === "edit"} label="Home Team" onChange={(value) => props.onHomeChange(asId(value))} required value={props.homeTeamId ? String(props.homeTeamId) : null} />
    <Select classNames={{ input: "match-form-input app-control-input", label: "match-form-input-label app-control-label" }} data={data.map((item) => ({ ...item, disabled: Number(item.value) === props.homeTeamId }))} disabled={props.mode === "edit"} label="Away Team" onChange={(value) => props.onAwayChange(asId(value))} required value={props.awayTeamId ? String(props.awayTeamId) : null} />
  </SimpleGrid></Box>;
}
