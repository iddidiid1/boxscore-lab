import { ApiClientError } from "../../teams/api/teams";
import type { ApiErrorResponse } from "../../teams/types";
import type { EventConfigurationPayload, EventDetail, EventListItem, EventOutcomesPayload } from "../types";
import { API_BASE_URL } from "../../../shared/api/base";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const data = await response.json() as T | ApiErrorResponse;
  if (!response.ok) throw new ApiClientError(data as ApiErrorResponse);
  return data as T;
}

export function fetchEvents(signal?: AbortSignal) { return request<{ events: EventListItem[] }>("/events", { signal }); }
export function fetchEvent(slug: string, signal?: AbortSignal) { return request<EventDetail>(`/events/${slug}`, { signal }); }
export function createEvent(data: EventConfigurationPayload) { return request<EventDetail>("/events", { method: "POST", body: JSON.stringify(data) }); }
export function updateEvent(slug: string, data: EventConfigurationPayload) { return request<EventDetail>(`/events/${slug}`, { method: "PATCH", body: JSON.stringify(data) }); }
export function updateEventOutcomes(slug: string, data: EventOutcomesPayload) { return request<EventDetail>(`/events/${slug}/outcomes`, { method: "PATCH", body: JSON.stringify(data) }); }
export function archiveEvent(slug: string) { return request<{ id: number; slug: string; archivedAt: string }>(`/events/${slug}/archive`, { method: "POST" }); }
