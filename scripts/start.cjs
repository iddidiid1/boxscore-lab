// Launch BoxScore Lab in production mode: the backend serves the API and the
// built frontend from a single Node process (no Vite dev server).
//
//   pnpm start
//
// Requires a prior `pnpm build`. Exits with a clear message if build output is missing.

const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

function findRepoRoot() {
  let dir = __dirname;
  while (true) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error("Could not locate repository root (pnpm-workspace.yaml not found).");
    dir = parent;
  }
}

const repoRoot = findRepoRoot();
const backendEntry = path.join(repoRoot, "apps", "backend", "dist", "main.js");
const frontendIndex = path.join(repoRoot, "apps", "frontend", "dist", "index.html");

const missing = [];
if (!fs.existsSync(backendEntry)) missing.push("backend (apps/backend/dist/main.js)");
if (!fs.existsSync(frontendIndex)) missing.push("frontend (apps/frontend/dist/index.html)");
if (missing.length) {
  console.error(`[start] Missing build output: ${missing.join(", ")}.`);
  console.error("[start] Run `pnpm build` first.");
  process.exit(1);
}

const port = process.env.PORT || "4000";
console.log(`[start] Starting BoxScore Lab (production mode) at http://localhost:${port}`);

const child = spawn(process.execPath, [backendEntry], {
  cwd: repoRoot,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" }
});

child.on("exit", (code) => process.exit(code ?? 0));
