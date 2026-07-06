// Base URL for the backend API. Configurable via VITE_API_BASE_URL so a dev
// instance can point at a non-default port (e.g. an isolated worktree running
// the backend on 4100). Falls back to the standard local backend origin.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
