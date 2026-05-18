import { Box } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { AppProviders } from "./providers";
import { appPages, type PageKey } from "./router";
import { CreateTeamPage } from "../pages/CreateTeamPage";
import { ManageTeamPage } from "../pages/ManageTeamPage";
import { PlayerDetailPage } from "../pages/PlayerDetailPage";
import { TeamDetailPage } from "../pages/TeamDetailPage";
import { Sidebar } from "../shared/components/navigation";

function getPageKeyFromPath(pathname: string): PageKey {
  const firstPathSegment = pathname.split("/").filter(Boolean)[0];

  if (appPages.some((item) => item.key === firstPathSegment)) {
    return firstPathSegment as PageKey;
  }

  return "home";
}

function AppContent() {
  const [activePage, setActivePage] = useState<PageKey>(() =>
    getPageKeyFromPath(window.location.pathname)
  );
  const [pathname, setPathname] = useState(window.location.pathname);

  const page = useMemo(
    () => appPages.find((item) => item.key === activePage) ?? appPages[0],
    [activePage]
  );
  const ActivePage = page.Component;
  const isCreateTeamPage = pathname === "/teams/new" || pathname === "/teams/new/";
  const isManageTeamPage = /^\/teams\/[^/]+\/manage\/?$/.test(pathname);
  const isTeamDetailPage = pathname.startsWith("/teams/") && !isManageTeamPage && !isCreateTeamPage;
  const isPlayerDetailPage = /^\/players\/[^/]+\/?$/.test(pathname);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
      setActivePage(getPageKeyFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function handleNavigate(pageKey: PageKey) {
    const nextPath = pageKey === "home" ? "/" : `/${pageKey}`;

    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
    setActivePage(pageKey);
  }

  return (
    <Box className="app-shell">
      <Sidebar activeKey={activePage} items={appPages} onNavigate={handleNavigate} />

      <Box className="content" component="main">
        {isCreateTeamPage ? (
          <CreateTeamPage />
        ) : isManageTeamPage ? (
          <ManageTeamPage />
        ) : isTeamDetailPage ? (
          <TeamDetailPage />
        ) : isPlayerDetailPage ? (
          <PlayerDetailPage />
        ) : (
          <ActivePage />
        )}
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
