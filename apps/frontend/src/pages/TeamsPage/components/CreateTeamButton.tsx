import { Button } from "@mantine/core";
import { Plus } from "lucide-react";

export function CreateTeamButton() {
  return (
    <Button
      className="create-team-button"
      component="a"
      href="/teams/new"
      leftSection={<Plus size={16} />}
      variant="filled"
    >
      Create Team
    </Button>
  );
}
