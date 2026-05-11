import type { HealthResponse } from "../types/api";

export async function getApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch("http://localhost:4000/api/health", { signal });
  const data = (await response.json()) as HealthResponse;

  if (!response.ok) {
    throw new Error("API health check failed");
  }

  return data;
}
