// Initialize (or re-initialize) the active BoxScore Lab database.
//
//   pnpm app:init                -> validate env, generate client, apply migrations, seed divisions
//   pnpm app:init --no-seed      -> same, but skip seeding the default divisions
//
// This is idempotent and non-destructive:
//   - `prisma migrate deploy` only applies pending migrations (never drops data).
//   - Seeding upserts the default divisions (no sample teams/events/matches).
// Re-running it on an existing database keeps all existing records.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { repoRoot, envValue, resolveActiveDbFile } = require("./lib/db-common.cjs");

function validateEnv() {
  const problems = [];

  if (!fs.existsSync(path.join(repoRoot, ".env"))) {
    problems.push('.env not found. Copy it from the template first: cp .env.example .env');
  }

  let activeDb;
  try {
    activeDb = resolveActiveDbFile();
  } catch (error) {
    problems.push(`DATABASE_URL: ${error.message}`);
  }

  const port = envValue("PORT");
  if (port !== undefined && !(Number.isInteger(Number(port)) && Number(port) > 0)) {
    problems.push(`PORT must be a positive integer (got "${port}").`);
  }

  return { problems, activeDb };
}

// Prisma CLI is resolved via PATH (populated by pnpm); use a shell so Windows finds prisma.CMD.
function runPrisma(label, args, env) {
  const commandLine = `prisma ${args.join(" ")}`;
  console.log(`\n[app:init] ${label}: ${commandLine}`);
  const result = spawnSync(commandLine, { cwd: repoRoot, stdio: "inherit", shell: true, env });
  if (result.status !== 0) throw new Error(`${label} failed (exit ${result.status ?? "unknown"}).`);
}

// Node scripts are invoked directly (no shell) so a node.exe path containing spaces is safe.
function runNode(label, scriptRelPath, env) {
  console.log(`\n[app:init] ${label}: node ${scriptRelPath}`);
  const result = spawnSync(process.execPath, [scriptRelPath], { cwd: repoRoot, stdio: "inherit", env });
  if (result.status !== 0) throw new Error(`${label} failed (exit ${result.status ?? "unknown"}).`);
}

// True if a generated Prisma Client is already present and importable.
function prismaClientUsable() {
  try {
    const { PrismaClient } = require("@prisma/client");
    return typeof PrismaClient === "function";
  } catch {
    return false;
  }
}

function main() {
  const skipSeed = process.argv.includes("--no-seed");

  const { problems, activeDb } = validateEnv();
  if (problems.length) {
    console.error("[app:init] Environment validation failed:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
    return;
  }

  console.log(`[app:init] Active database: ${activeDb}`);
  const existed = fs.existsSync(activeDb);
  console.log(`[app:init] ${existed ? "Database exists — applying any pending migrations." : "Database will be created."}`);

  // Force the resolved DATABASE_URL for every child so Prisma targets the same file
  // regardless of how it loads .env.
  const childEnv = { ...process.env, DATABASE_URL: envValue("DATABASE_URL") };

  try {
    runPrisma("Generate Prisma Client", ["generate", "--schema", "prisma/schema.prisma"], childEnv);
  } catch (error) {
    if (prismaClientUsable()) {
      console.warn(`[app:init] Prisma generate did not complete (${error.message.trim()}).`);
      console.warn("[app:init] An existing Prisma Client is present, so continuing. This usually means the app");
      console.warn("[app:init] is still running. If you changed the schema, stop the app and run `pnpm db:generate`.");
    } else {
      throw error;
    }
  }

  runPrisma("Apply migrations", ["migrate", "deploy", "--schema", "prisma/schema.prisma"], childEnv);

  if (skipSeed) {
    console.log("\n[app:init] Skipping division seed (--no-seed).");
  } else {
    runNode("Seed default divisions", "prisma/seed.cjs", childEnv);
  }

  console.log("\n[app:init] Done. The database is initialized and ready to use.");
  console.log("[app:init] Next: start the app with `pnpm dev`, then create your teams and events.");
}

try {
  main();
} catch (error) {
  console.error(`\n[app:init] Failed: ${error.message}`);
  process.exitCode = 1;
}
