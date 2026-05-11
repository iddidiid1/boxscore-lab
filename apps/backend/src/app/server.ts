import { config } from "../config/index.js";
import { createApp } from "./app.js";

export function startServer() {
  const app = createApp();

  return app.listen(config.port, () => {
    console.log(`API server listening on http://localhost:${config.port}`);
  });
}
