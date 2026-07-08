import type { HealthResponse } from "../types/api";
import { API_BASE_URL } from "./base";

export async function getApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, { signal });
  const data = (await response.json()) as HealthResponse;

  if (!response.ok) {
    throw new Error("API health check failed");
  }

  return data;
}
