import { Button, Group } from "@mantine/core";

type MatchFormActionsProps = {
  cancelHref: string;
  canSave: boolean;
};

export function MatchFormActions({ cancelHref, canSave }: MatchFormActionsProps) {
  return (
    <Group gap="sm">
      <Button
        className="match-form-save-button"
        disabled={!canSave}
        onClick={(event) => event.preventDefault()}
      >
        Save
      </Button>
      <Button className="match-form-cancel-button" component="a" href={cancelHref} variant="outline">
        Cancel
      </Button>
    </Group>
  );
}
