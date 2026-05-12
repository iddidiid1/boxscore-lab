import { Paper, Stack } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import { ApiHealthCheckBox } from "./ApiHealthCheckBox";
import { NavigationTab } from "./NavigationTab";
import { SidebarHeader } from "./SidebarHeader";

type SidebarNavigationItem<Key extends string> = {
  Icon: LucideIcon;
  key: Key;
  label: string;
};

type SidebarProps<Key extends string> = {
  activeKey: Key;
  items: Array<SidebarNavigationItem<Key>>;
  onNavigate: (key: Key) => void;
};

export function Sidebar<Key extends string>({
  activeKey,
  items,
  onNavigate
}: SidebarProps<Key>) {
  return (
    <Paper className="sidebar" component="aside">
      <Stack className="sidebar-layout" gap="xl">
        <Stack gap="xl">
          <SidebarHeader />

          <Stack component="nav" gap={6} aria-label="Primary navigation">
            {items.map((item) => (
              <NavigationTab
                active={item.key === activeKey}
                icon={item.Icon}
                key={item.key}
                label={item.label}
                onClick={() => onNavigate(item.key)}
                path={item.key}
              />
            ))}
          </Stack>
        </Stack>

        <ApiHealthCheckBox />
      </Stack>
    </Paper>
  );
}
