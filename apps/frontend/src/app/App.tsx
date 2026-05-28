import { Box } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { AppProviders } from "./providers";
import { appPages, type PageKey } from "./router";
import { CreateMatchPage } from "../pages/CreateMatchPage";
import { CreateTeamPage } from "../pages/CreateTeamPage";
import { EditMatchPage } from "../pages/EditMatchPage";
import { EventDetailPage } from "../pages/EventDetailPage";
import { EventFormPage } from "../pages/EventFormPage";
import { ManageTeamPage } from "../pages/ManageTeamPage";
import { MatchDetailPage } from "../pages/MatchDetailPage";
import { PlayerDetailPage } from "../pages/PlayerDetailPage";
import { TeamDetailPage } from "../pages/TeamDetailPage";
import { Sidebar } from "../shared/components/navigation";

function getPageKeyFromPath(pathname: string): PageKey {
  const firstPathSegment = pathname.split("/").filter(Boolean)[0];

  if (appPages.some((item) => item.key === firstPathSegment)) {
    return firstPathSegment as PageKey;
  }

  return "teams";
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
  const isCreateMatchPage = pathname === "/matches/create" || pathname === "/matches/create/";
  const isCreateEventPage = pathname === "/events/new" || pathname === "/events/new/";
  const editMatchMatch = pathname.match(/^\/matches\/([^/]+)\/edit\/?$/);
  const editEventMatch = pathname.match(/^\/events\/([^/]+)\/edit\/?$/);
  const isManageTeamPage = /^\/teams\/[^/]+\/manage\/?$/.test(pathname);
  const isTeamDetailPage = pathname.startsWith("/teams/") && !isManageTeamPage && !isCreateTeamPage;
  const isPlayerDetailPage = /^\/players\/[^/]+\/?$/.test(pathname);
  const eventDetailMatch = pathname.match(/^\/events\/([^/]+)\/?$/);
  const matchDetailMatch = pathname.match(/^\/matches\/([^/]+)\/?$/);

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
    const nextPath = `/${pageKey}`;

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
        ) : isCreateMatchPage ? (
          <CreateMatchPage />
        ) : isCreateEventPage ? (
          <EventFormPage mode="create" />
        ) : editMatchMatch ? (
          <EditMatchPage matchId={editMatchMatch[1]} />
        ) : editEventMatch ? (
          <EventFormPage eventId={editEventMatch[1]} mode="edit" />
        ) : isManageTeamPage ? (
          <ManageTeamPage />
        ) : isTeamDetailPage ? (
          <TeamDetailPage />
        ) : isPlayerDetailPage ? (
          <PlayerDetailPage />
        ) : eventDetailMatch ? (
          <EventDetailPage eventId={eventDetailMatch[1]} />
        ) : matchDetailMatch ? (
          <MatchDetailPage matchId={matchDetailMatch[1]} />
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
