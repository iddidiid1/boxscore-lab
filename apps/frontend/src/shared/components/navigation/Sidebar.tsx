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
    <aside className="sidebar">
      <div className="sidebar-layout" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>
          <SidebarHeader />

          <div className="nav-section-label">League</div>

          <nav aria-label="Primary navigation">
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
          </nav>
        </div>

        <ApiHealthCheckBox />
      </div>
    </aside>
  );
}
