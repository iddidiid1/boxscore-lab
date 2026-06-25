import type {
  ApiErrorResponse,
  Division,
  TeamDetail,
  TeamDivisionGroup,
  TeamMutationPayload
} from "../types";

const API_BASE_URL = "http://localhost:4000/api";

export class ApiClientError extends Error {
  response: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.response = response;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    throw new ApiClientError(data as ApiErrorResponse);
  }

  return data as T;
}

export async function fetchDivisions(signal?: AbortSignal) {
  return request<{ divisions: Division[] }>("/divisions", { signal });
}

export async function fetchTeams(signal?: AbortSignal) {
  return request<{ divisions: TeamDivisionGroup[] }>("/teams", { signal });
}

export async function fetchTeam(slug: string, signal?: AbortSignal) {
  return request<TeamDetail>(`/teams/${slug}`, { signal });
}

export async function createTeam(data: TeamMutationPayload) {
  return request<TeamDetail>("/teams", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateTeam(slug: string, data: TeamMutationPayload) {
  return request<TeamDetail>(`/teams/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function archiveTeam(slug: string) {
  return request<{ id: number; slug: string; archivedAt: string }>(`/teams/${slug}/archive`, {
    method: "POST"
  });
}

