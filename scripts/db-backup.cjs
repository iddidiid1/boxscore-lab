// Create a consistent snapshot of the active SQLite database into backups/.
//
//   node scripts/db-backup.cjs           -> manual backup  (boxscore-<ts>.db)
//   node scripts/db-backup.cjs --auto    -> automatic backup (auto-<ts>.db), pruned to AUTO_KEEP
//
// A missing active database is treated as "nothing to back up" (exit 0), so this
// can safely run before the first migration / initialization creates the file.

const fs = require("node:fs");
const path = require("node:path");
const {
  resolveActiveDbFile,
  openPrismaForFile,
  vacuumInto,
  ensureBackupsDir,
  timestamp,
  formatBytes,
  pruneBackups
} = require("./lib/db-common.cjs");

const AUTO_KEEP = Number(process.env.DB_BACKUP_KEEP) > 0 ? Number(process.env.DB_BACKUP_KEEP) : 10;

async function main() {
  const auto = process.argv.includes("--auto");
  const activeDb = resolveActiveDbFile();

  if (!fs.existsSync(activeDb)) {
    console.log(`[db:backup] No active database at ${activeDb} — nothing to back up (skipping).`);
    return;
  }

  const dir = ensureBackupsDir();
  const prefix = auto ? "auto-" : "boxscore-";
  const target = path.join(dir, `${prefix}${timestamp()}.db`);

  const prisma = openPrismaForFile(activeDb);
  try {
    await vacuumInto(prisma, target);
  } finally {
    await prisma.$disconnect();
  }

  const size = fs.statSync(target).size;
  console.log(`[db:backup] Backed up ${activeDb} -> ${target} (${formatBytes(size)}).`);

  if (auto) {
    const removed = pruneBackups("auto-", AUTO_KEEP);
    if (removed.length) console.log(`[db:backup] Pruned ${removed.length} old auto backup(s), keeping newest ${AUTO_KEEP}.`);
  }
}

main().catch((error) => {
  console.error(`[db:backup] Failed: ${error.message}`);
  process.exitCode = 1;
});
