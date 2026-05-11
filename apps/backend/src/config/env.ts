import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
dotenv.config();

const port = Number(process.env.PORT ?? 4000);

export const env = {
  port: Number.isFinite(port) ? port : 4000,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"
};
