import { useEffect, useState } from "react";
import { getApiHealth } from "../api/health";
import type { ApiStatus } from "../types/api";

export function useApiHealth() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [lastChecked, setLastChecked] = useState<string>("Pending");

  useEffect(() => {
    const controller = new AbortController();

    function updateLastChecked() {
      setLastChecked(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }

    async function checkApi() {
      try {
        const data = await getApiHealth(controller.signal);
        setApiStatus(data.status === "ok" ? "connected" : "offline");
        updateLastChecked();
      } catch {
        if (!controller.signal.aborted) {
          setApiStatus("offline");
          updateLastChecked();
        }
      }
    }

    checkApi();

    return () => controller.abort();
  }, []);

  return { apiStatus, lastChecked };
}
