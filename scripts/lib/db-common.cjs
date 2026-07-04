// Shared helpers for database backup/restore/validate scripts.
// Zero external dependencies beyond @prisma/client (already a project dependency).

const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

// Walk up from this file until we find the workspace root (pnpm-workspace.yaml).
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
const prismaDir = path.join(repoRoot, "prisma");
const backupsDir = path.join(repoRoot, "backups");

// Minimal .env reader — pnpm does not auto-load .env for scripts.
// An already-set process.env value wins over the file.
function envValue(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.join(repoRoot, ".env");
  if (!fs.existsSync(envPath)) return undefined;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && match[1] === key) {
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      return value;
    }
  }
  return undefined;
}

// Resolve DATABASE_URL into an absolute path to the active SQLite file.
// SQLite relative paths in Prisma are resolved relative to the schema directory.
function resolveActiveDbFile() {
  const url = envValue("DATABASE_URL");
  if (!url) throw new Error("DATABASE_URL is not set (checked process.env and repo-root .env).");
  if (!url.startsWith("file:")) {
    throw new Error(`DATABASE_URL is not a SQLite file: URL (got "${url}"). Backup tooling only supports SQLite.`);
  }
  const raw = url.slice("file:".length);
  const abs = path.resolve(prismaDir, raw);
  ensureInsideRepo(abs);
  return abs;
}

// Safety rail: refuse paths that escape the repository.
function ensureInsideRepo(absPath) {
  const rel = path.relative(repoRoot, absPath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Refusing to operate on a path outside the repository: ${absPath}`);
  }
}

// Build a Prisma-understood datasource URL for an arbitrary SQLite file.
// Prisma resolves relative file: URLs against the schema directory, so we
// express the target relative to prisma/ using forward slashes (cross-platform).
function prismaUrlForFile(absPath) {
  const rel = path.relative(prismaDir, absPath).split(path.sep).join("/");
  return "file:" + rel;
}

function openPrismaForFile(absPath) {
  return new PrismaClient({ datasources: { db: { url: prismaUrlForFile(absPath) } } });
}

// Consistent single-file snapshot via VACUUM INTO — safe even while the app runs.
// Uses an absolute, forward-slashed path so it does not depend on process cwd.
async function vacuumInto(prisma, targetAbs) {
  const sqlPath = targetAbs.split(path.sep).join("/").replace(/'/g, "''");
  await prisma.$executeRawUnsafe(`VACUUM INTO '${sqlPath}'`);
}

// Returns { ok: boolean, problems: string[] }.
async function integrityCheck(prisma) {
  const problems = [];
  const integrity = await prisma.$queryRawUnsafe("PRAGMA integrity_check");
  const rows = Array.isArray(integrity) ? integrity.map((row) => Object.values(row)[0]) : [];
  if (!(rows.length === 1 && rows[0] === "ok")) problems.push(...rows.map((row) => `integrity_check: ${row}`));
  const fkRows = await prisma.$queryRawUnsafe("PRAGMA foreign_key_check");
  if (Array.isArray(fkRows) && fkRows.length) {
    for (const row of fkRows) problems.push(`foreign_key_check: ${JSON.stringify(row)}`);
  }
  return { ok: problems.length === 0, problems };
}

function timestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "-" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function ensureBackupsDir() {
  fs.mkdirSync(backupsDir, { recursive: true });
  return backupsDir;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Keep only the newest `keep` files matching a prefix in backups/.
function pruneBackups(prefix, keep) {
  if (!fs.existsSync(backupsDir)) return [];
  const files = fs
    .readdirSync(backupsDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(".db"))
    .map((name) => ({ name, mtime: fs.statSync(path.join(backupsDir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  const removed = [];
  for (const file of files.slice(keep)) {
    fs.rmSync(path.join(backupsDir, file.name));
    removed.push(file.name);
  }
  return removed;
}

module.exports = {
  repoRoot,
  prismaDir,
  backupsDir,
  envValue,
  resolveActiveDbFile,
  ensureInsideRepo,
  openPrismaForFile,
  vacuumInto,
  integrityCheck,
  timestamp,
  ensureBackupsDir,
  formatBytes,
  pruneBackups
};
