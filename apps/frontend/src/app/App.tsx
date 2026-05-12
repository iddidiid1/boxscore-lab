import { Box } from "@mantine/core";
import { useMemo, useState } from "react";
import { AppProviders } from "./providers";
import { appPages, type PageKey } from "./router";
import { Sidebar } from "../shared/components/navigation";

function AppContent() {
  const [activePage, setActivePage] = useState<PageKey>("home");

  const page = useMemo(
    () => appPages.find((item) => item.key === activePage) ?? appPages[0],
    [activePage]
  );
  const ActivePage = page.Component;

  return (
    <Box className="app-shell">
      <Sidebar activeKey={activePage} items={appPages} onNavigate={setActivePage} />

      <Box className="content" component="main">
        <ActivePage />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
