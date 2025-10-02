import { env } from "@envyron/lib";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.MAX_DATABASE_CONNECTIONS,
  min: env.MIN_DATABASE_CONNECTIONS,
  idleTimeoutMillis: env.IDLE_TIMEOUT_IN_SECONDS * 1000,
  connectionTimeoutMillis: env.CONNECTION_TIMEOUT_IN_SECONDS * 1000,
  keepAlive: true,
});

export const db = drizzle({ client: pool });
