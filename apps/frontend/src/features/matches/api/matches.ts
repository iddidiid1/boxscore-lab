import { ApiClientError } from "../../teams/api/teams";
import type {
  ApiErrorResponse,
  CreateMatchPayload,
  MatchDetail,
  MatchFormOptions,
  MatchListResponse,
  UpdateMatchPayload
} from "../types";

const API_BASE_URL = "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }
  });
  const data = await response.json() as T | ApiErrorResponse;
  if (!response.ok) throw new ApiClientError(data as ApiErrorResponse);
  return data as T;
}

export function fetchMatches(params: { page: number; pageSize: number; eventId?: number; teamId?: number; stageTagId?: number }, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) });
  if (params.eventId) query.set("eventId", String(params.eventId));
  if (params.teamId) query.set("teamId", String(params.teamId));
  if (params.stageTagId) query.set("stageTagId", String(params.stageTagId));
  return request<MatchListResponse>(`/matches?${query}`, { signal });
}

export function fetchMatchFormOptions(eventId?: number, signal?: AbortSignal) {
  return request<MatchFormOptions>(`/matches/form-options${eventId ? `?eventId=${eventId}` : ""}`, { signal });
}

export function fetchMatch(id: number, signal?: AbortSignal) {
  return request<MatchDetail>(`/matches/${id}`, { signal });
}

export function createMatch(payload: CreateMatchPayload) {
  return request<MatchDetail>("/matches", { method: "POST", body: JSON.stringify(payload) });
}

export function updateMatch(id: number, payload: UpdateMatchPayload) {
  return request<MatchDetail>(`/matches/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function voidMatch(id: number) {
  return request<{ id: number; voidedAt: string }>(`/matches/${id}/void`, { method: "POST" });
}

export function restoreMatch(id: number) {
  return request<MatchDetail>(`/matches/${id}/restore`, { method: "POST" });
}
