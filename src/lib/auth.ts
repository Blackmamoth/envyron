import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { BetterAuthConfig } from "./config";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: BetterAuthConfig.GOOGLE_CLIENT_ID,
      clientSecret: BetterAuthConfig.GOOGLE_CLIENT_SECRET,
      redirectURI: BetterAuthConfig.GOOGLE_CALLBACK_URL,
    },
    github: {
      clientId: BetterAuthConfig.GITHUB_CLIENT_ID,
      clientSecret: BetterAuthConfig.GITHUB_CLIENT_SECRET,
      redirectURI: BetterAuthConfig.GITHUB_CALLBACK_URL,
      scope: ["read:user", "user:email"],
    },
  },
});
