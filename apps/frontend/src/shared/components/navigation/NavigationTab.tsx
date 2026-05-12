import { Button } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

type NavigationTabProps = {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  path: string;
};

export function NavigationTab({
  active,
  icon: Icon,
  label,
  onClick,
  path
}: NavigationTabProps) {
  return (
    <Button
      aria-current={active ? "page" : undefined}
      className="nav-item"
      data-active={active || undefined}
      data-path={path}
      justify="flex-start"
      leftSection={<Icon className="nav-icon" aria-hidden="true" />}
      onClick={onClick}
      radius="sm"
      variant="subtle"
    >
      {label}
    </Button>
  );
}
