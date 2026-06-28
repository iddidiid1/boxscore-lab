import { Button, Group } from "@mantine/core";

type MatchFormActionsProps = {
  cancelHref: string;
  canSave: boolean;
};

export function MatchFormActions({ cancelHref, canSave }: MatchFormActionsProps) {
  return (
    <Group gap="sm">
      <Button
        className="match-form-save-button app-action-button app-action-button--primary"
        disabled={!canSave}
        onClick={(event) => event.preventDefault()}
      >
        Save
      </Button>
      <Button className="match-form-cancel-button app-action-button app-action-button--secondary" component="a" href={cancelHref} variant="outline">
        Cancel
      </Button>
    </Group>
  );
}
