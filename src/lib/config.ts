import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const dbSchema = z.object({
  DATABASE_URL: z.string(),
});

const betterAuthSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),
});

export const DBConfig = dbSchema.parse(process.env);

export const BetterAuthConfig = betterAuthSchema.parse(process.env);
