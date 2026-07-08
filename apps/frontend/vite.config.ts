import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Load .env from the repo root so a single root .env holds both backend
  // (DATABASE_URL, PORT) and frontend (VITE_*) settings per checkout/worktree.
  envDir: "../..",
  server: {
    port: 5173
  }
});
