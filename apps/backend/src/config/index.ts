import { env } from "./env.js";

export const config = {
  port: env.port,
  frontendOrigin: env.frontendOrigin
};
