import { useEffect, useMemo, useState } from "react";

type PageKey =
  | "home"
  | "teams"
  | "players"
  | "seasons"
  | "competitions"
  | "matches"
  | "stats";

const pages: Array<{ key: PageKey; label: string; description: string }> = [
  {
    key: "home",
    label: "Home",
    description: "MVP overview for the local fantasy league statistics app."
  },
  {
    key: "teams",
    label: "Teams",
    description: "Placeholder for team records and basic team details."
  },
  {
    key: "players",
    label: "Players",
    description: "Placeholder for player profiles linked to teams."
  },
  {
    key: "seasons",
    label: "Seasons",
    description: "Placeholder for season management."
  },
  {
    key: "competitions",
    label: "Competitions",
    description: "Placeholder for competitions and manually entered results."
  },
  {
    key: "matches",
    label: "Matches",
    description: "Placeholder for match creation, scores, and player stats."
  },
  {
    key: "stats",
    label: "Stats",
    description: "Placeholder for derived player and team statistics."
  }
];

type ApiStatus = "checking" | "connected" | "offline";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const page = useMemo(
    () => pages.find((item) => item.key === activePage) ?? pages[0],
    [activePage]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        const response = await fetch("http://localhost:4000/api/health", {
          signal: controller.signal
        });
        const data = (await response.json()) as { status?: string };
        setApiStatus(response.ok && data.status === "ok" ? "connected" : "offline");
      } catch {
        if (!controller.signal.aborted) {
          setApiStatus("offline");
        }
      }
    }

    checkApi();

    return () => controller.abort();
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">FLS</span>
          <div>
            <h1>Fantasy League Stats</h1>
            <p>Local MVP</p>
          </div>
        </div>

        <nav className="navigation" aria-label="Primary navigation">
          {pages.map((item) => (
            <button
              className={item.key === activePage ? "nav-item active" : "nav-item"}
              key={item.key}
              onClick={() => setActivePage(item.key)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Offline-first web app</p>
            <h2>{page.label}</h2>
          </div>
          <div className={`api-status ${apiStatus}`}>
            <span aria-hidden="true" />
            API {apiStatus === "checking" ? "checking" : apiStatus}
          </div>
        </header>

        <section className="placeholder" aria-labelledby="page-title">
          <p className="section-label">Placeholder</p>
          <h3 id="page-title">{page.label}</h3>
          <p>{page.description}</p>
        </section>
      </main>
    </div>
  );
}

export default App;
