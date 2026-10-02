import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePGlite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __naadeLocalPGlite?: PGlite;
};

function createDatabase() {
  if (process.env.LOCAL_PGLITE === "1") {
    const dataDirectory = path.resolve(
      process.cwd(),
      process.env.PGLITE_DATA_DIR || ".data/postgres",
    );
    const client = globalForDb.__naadeLocalPGlite ?? new PGlite(dataDirectory);

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__naadeLocalPGlite = client;
    }

    return drizzlePGlite({ client });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when LOCAL_PGLITE is disabled");
  }

  const pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({ connectionString: databaseUrl });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return drizzlePostgres(pool);
}

export const db = createDatabase();
