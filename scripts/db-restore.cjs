// Restore the active SQLite database from a selected backup file.
//
//   node scripts/db-restore.cjs <backup-file>          -> dry run: print the plan, change nothing
//   node scripts/db-restore.cjs <backup-file> --yes     -> perform the restore
//
// Safety rails:
//   - Refuses a missing/non-file/invalid backup (must pass integrity_check).
//   - Refuses if DATABASE_URL is not a SQLite file: URL or resolves outside the repo.
//   - Always writes a raw pre-restore snapshot of the current database first.
//   - Removes stale -wal/-shm sidecars so old WAL data cannot overwrite the restore.
//   - Requires an explicit --yes to actually overwrite.
//
// Stop the running app before restoring.

const fs = require("node:fs");
const path = require("node:path");
const {
  resolveActiveDbFile,
  openPrismaForFile,
  integrityCheck,
  ensureInsideRepo,
  ensureBackupsDir,
  timestamp,
  formatBytes
} = require("./lib/db-common.cjs");

function removeSidecars(dbFile) {
  const removed = [];
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    const sidecar = dbFile + suffix;
    if (fs.existsSync(sidecar)) {
      fs.rmSync(sidecar);
      removed.push(path.basename(sidecar));
    }
  }
  return removed;
}

async function main() {
  const args = process.argv.slice(2);
  const confirm = args.includes("--yes");
  const source = args.find((arg) => arg !== "--yes");

  if (!source) throw new Error("Usage: node scripts/db-restore.cjs <backup-file> [--yes]");

  const backupFile = path.resolve(process.cwd(), source);
  ensureInsideRepo(backupFile);
  if (!fs.existsSync(backupFile) || !fs.statSync(backupFile).isFile()) {
    throw new Error(`Backup file not found or not a file: ${backupFile}`);
  }

  // Validate the backup BEFORE touching the live database.
  const check = openPrismaForFile(backupFile);
  let integrity;
  try {
    integrity = await integrityCheck(check);
  } finally {
    await check.$disconnect();
  }
  if (!integrity.ok) {
    console.error(`[db:restore] Refusing to restore — backup failed integrity check:`);
    for (const problem of integrity.problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
    return;
  }

  const target = resolveActiveDbFile();
  const targetExists = fs.existsSync(target);

  console.log(`[db:restore] Source : ${backupFile} (${formatBytes(fs.statSync(backupFile).size)}, integrity OK)`);
  console.log(`[db:restore] Target : ${target}${targetExists ? "" : " (does not exist yet)"}`);

  if (!confirm) {
    console.log("");
    console.log("[db:restore] DRY RUN — no changes made. If this looks correct, re-run with --yes:");
    console.log(`    pnpm db:restore ${source} --yes`);
    console.log("[db:restore] On --yes: a pre-restore snapshot of the current database is written to backups/,");
    console.log("[db:restore] the target is overwritten, and stale -wal/-shm sidecars are removed.");
    console.log("[db:restore] Stop the running app before restoring.");
    return;
  }

  // Pre-restore safety snapshot (raw copy — robust even if the current db is inconsistent).
  if (targetExists) {
    const snapshot = path.join(ensureBackupsDir(), `pre-restore-${timestamp()}.db`);
    fs.copyFileSync(target, snapshot);
    console.log(`[db:restore] Pre-restore snapshot: ${snapshot}`);
  }

  fs.copyFileSync(backupFile, target);
  const removed = removeSidecars(target);
  if (removed.length) console.log(`[db:restore] Removed stale sidecars: ${removed.join(", ")}`);

  console.log(`[db:restore] Restore complete. Active database is now a copy of ${path.basename(backupFile)}.`);
}

main().catch((error) => {
  console.error(`[db:restore] Failed: ${error.message}`);
  process.exitCode = 1;
});
