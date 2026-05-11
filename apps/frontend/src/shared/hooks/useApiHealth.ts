import { useEffect, useState } from "react";
import { getApiHealth } from "../api/health";
import type { ApiStatus } from "../types/api";

export function useApiHealth() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        const data = await getApiHealth(controller.signal);
        setApiStatus(data.status === "ok" ? "connected" : "offline");
      } catch {
        if (!controller.signal.aborted) {
          setApiStatus("offline");
        }
      }
    }

    checkApi();

    return () => controller.abort();
  }, []);

  return apiStatus;
}
