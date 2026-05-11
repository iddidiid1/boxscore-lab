import { useMemo, useState } from "react";
import { appPages, type PageKey } from "./router";
import { AppProviders } from "./providers";
import { useApiHealth } from "../shared/hooks/useApiHealth";

function AppContent() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const apiStatus = useApiHealth();
  const page = useMemo(
    () => appPages.find((item) => item.key === activePage) ?? appPages[0],
    [activePage]
  );
  const ActivePage = page.Component;

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
          {appPages.map((item) => (
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

        <ActivePage />
      </main>
    </div>
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
