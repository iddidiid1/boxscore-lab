// Integrity-check a SQLite database file.
//
//   node scripts/db-validate.cjs                 -> validate the active database
//   node scripts/db-validate.cjs <file>          -> validate a specific file (e.g. a backup)
//
// Runs PRAGMA integrity_check and PRAGMA foreign_key_check. Exits non-zero on any problem.

const fs = require("node:fs");
const path = require("node:path");
const { resolveActiveDbFile, openPrismaForFile, ensureInsideRepo, integrityCheck } = require("./lib/db-common.cjs");

async function main() {
  const arg = process.argv[2];
  let target;
  if (arg) {
    target = path.resolve(process.cwd(), arg);
    ensureInsideRepo(target);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      throw new Error(`Not a file: ${target}`);
    }
  } else {
    target = resolveActiveDbFile();
    if (!fs.existsSync(target)) throw new Error(`Active database does not exist: ${target}`);
  }

  const prisma = openPrismaForFile(target);
  let result;
  try {
    result = await integrityCheck(prisma);
  } finally {
    await prisma.$disconnect();
  }

  if (result.ok) {
    console.log(`[db:validate] OK — ${target} passed integrity_check and foreign_key_check.`);
  } else {
    console.error(`[db:validate] FAILED — ${target} has problems:`);
    for (const problem of result.problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`[db:validate] Failed: ${error.message}`);
  process.exitCode = 1;
});
