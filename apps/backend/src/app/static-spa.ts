import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findRepoRoot(): string | undefined {
  let dir = __dirname;
  while (true) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

// In production, serve the built frontend and fall back to index.html so that
// direct SPA routes (e.g. /events/:slug, /matches/:id) load correctly.
// In development this is a no-op — the Vite dev server serves the frontend.
export function registerSpa(app: Express): void {
  if (process.env.NODE_ENV !== "production") return;

  const repoRoot = findRepoRoot();
  const distDir = repoRoot ? path.join(repoRoot, "apps", "frontend", "dist") : undefined;
  const indexHtml = distDir ? path.join(distDir, "index.html") : undefined;

  if (!distDir || !indexHtml || !fs.existsSync(indexHtml)) {
    console.warn("[static-spa] Built frontend not found — run `pnpm build`. Serving the API only.");
    return;
  }

  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(indexHtml);
  });

  console.log(`[static-spa] Serving built frontend from ${distDir}`);
}
