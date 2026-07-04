import { config } from "../config/index.js";
import { createApp } from "./app.js";
import { runStartupBackup } from "./startup-backup.js";
import { verifyDatabase } from "./startup-checks.js";

export async function startServer() {
  await verifyDatabase();

  const app = createApp();

  runStartupBackup();

  return app.listen(config.port, () => {
    console.log(`API server listening on http://localhost:${config.port}`);
  });
}
