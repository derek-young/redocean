import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const isDev = process.env.NODE_ENV === "development";

const connectionString = process.env.DATABASE_URL!;
const readOnlyConnectionString = process.env.DATABASE_URL_READONLY!;

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

const readOnlyClient = postgres(readOnlyConnectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, {
  schema,
  logger: isDev,
});

export const dbReadOnly = drizzle(readOnlyClient, {
  schema,
  logger: isDev,
});
