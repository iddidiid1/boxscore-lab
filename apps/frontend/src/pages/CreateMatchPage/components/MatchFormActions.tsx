import { Button, Group } from "@mantine/core";
export function MatchFormActions({ cancelHref, canSave, submitting, onSave, mode }: { cancelHref: string; canSave: boolean; submitting: boolean; onSave: () => void; mode: "create" | "edit" }) {
  return <Group gap="sm"><Button className="match-form-save-button app-action-button app-action-button--primary" disabled={!canSave || submitting} loading={submitting} onClick={onSave}>{mode === "create" ? "Create Match" : "Save Changes"}</Button><Button className="match-form-cancel-button app-action-button app-action-button--secondary" component="a" href={cancelHref} variant="outline">Cancel</Button></Group>;
}
