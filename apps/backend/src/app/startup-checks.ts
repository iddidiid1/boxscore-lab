import { prisma } from "../shared/db/prisma.js";

// Verify the database is reachable and initialized before accepting traffic.
// On failure, print an actionable message and exit non-zero rather than
// starting a server that will fail every request.
export async function verifyDatabase(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("[startup] DATABASE_URL is not set. Copy .env.example to .env, then run `pnpm app:init`.");
    process.exit(1);
  }

  try {
    // _prisma_migrations exists only after migrations have been applied, so this
    // confirms both connectivity and that the database has been initialized.
    await prisma.$queryRawUnsafe("SELECT 1 FROM _prisma_migrations LIMIT 1");
  } catch (error) {
    console.error(`[startup] Database is not available or not initialized (DATABASE_URL=${process.env.DATABASE_URL}).`);
    console.error("[startup] For a fresh or missing database, run `pnpm app:init`.");
    console.error(`[startup] Details: ${(error as Error).message}`);
    process.exit(1);
  }
}
