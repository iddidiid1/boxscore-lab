import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Walk up to the workspace root (pnpm-workspace.yaml) so this works in both
// dev (tsx) and built layouts.
function findRepoRoot(): string | undefined {
  let dir = __dirname;
  while (true) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

// Fire-and-forget automatic backup on startup. Never blocks or crashes the server:
// failures are logged as warnings. Reuses scripts/db-backup.cjs so automatic and
// manual backups behave identically.
export function runStartupBackup(): void {
  const repoRoot = findRepoRoot();
  if (!repoRoot) {
    console.warn("[startup-backup] Skipped: could not locate repository root.");
    return;
  }
  const script = path.join(repoRoot, "scripts", "db-backup.cjs");
  if (!fs.existsSync(script)) {
    console.warn(`[startup-backup] Skipped: backup script not found at ${script}.`);
    return;
  }

  const child = spawn(process.execPath, [script, "--auto"], { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  child.on("error", (error) => console.warn(`[startup-backup] Could not run backup: ${error.message}`));
  child.on("close", (code) => {
    if (code !== 0) console.warn(`[startup-backup] Backup exited with code ${code}.`);
  });
}
