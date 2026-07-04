import { startServer } from "./app/server.js";

startServer().catch((error) => {
  console.error("[startup] Failed to start server:", error);
  process.exit(1);
});
