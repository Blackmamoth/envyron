import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // DB CONFIG
    DATABASE_URL: z.url(),
    MAX_DATABASE_CONNECTIONS: z.coerce.number(),
    MIN_DATABASE_CONNECTIONS: z.coerce.number(),
    IDLE_TIMEOUT_IN_SECONDS: z.coerce.number(),
    CONNECTION_TIMEOUT_IN_SECONDS: z.coerce.number(),
    // OAuth Config
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_REDIRECT_URI: z.url(),
  },
  client: {},
  runtimeEnv: {
    // DB CONFIG
    DATABASE_URL: process.env.DATABASE_URL,
    MAX_DATABASE_CONNECTIONS: process.env.MAX_DATABASE_CONNECTIONS,
    MIN_DATABASE_CONNECTIONS: process.env.MIN_DATABASE_CONNECTIONS,
    IDLE_TIMEOUT_IN_SECONDS: process.env.IDLE_TIMEOUT_IN_SECONDS,
    CONNECTION_TIMEOUT_IN_SECONDS: process.env.CONNECTION_TIMEOUT_IN_SECONDS,
    // OAuth Config
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
  },
});
