const path = require("node:path");
const fs = require("node:fs");
const bcrypt = require("bcryptjs");
const { config } = require("dotenv");

config({ path: path.join(process.cwd(), ".env.local") });

const { ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.");
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters long.");
  process.exit(1);
}

function escapeSqlString(value) {
  return String(value).replace(/'/g, "''");
}

async function createAdmin() {
  const email = ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  if (process.env.LOCAL_PGLITE === "1") {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    const dataDirectory = path.resolve(
      process.cwd(),
      process.env.PGLITE_DATA_DIR || ".data/postgres",
    );
    fs.mkdirSync(path.dirname(dataDirectory), { recursive: true });
    const client = new PGlite(dataDirectory);

    try {
      await migrate(drizzle({ client }), {
        migrationsFolder: path.join(process.cwd(), "drizzle"),
      });

      const safeEmail = escapeSqlString(email);
      const safePasswordHash = escapeSqlString(passwordHash);
      await client.query(`
        INSERT INTO admin_users (email, password_hash)
        VALUES ('${safeEmail}', '${safePasswordHash}')
        ON CONFLICT (email) DO UPDATE
        SET password_hash = '${safePasswordHash}'
      `);
    } finally {
      await client.close();
    }
  } else {
    if (!DATABASE_URL) {
      throw new Error("Set DATABASE_URL or enable LOCAL_PGLITE in .env.local.");
    }

    const { Pool } = require("pg");
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl:
        DATABASE_URL.includes("supabase") ||
        DATABASE_URL.includes("neon") ||
        DATABASE_URL.includes("sslmode")
          ? { rejectUnauthorized: false }
          : undefined,
    });
    try {
      await pool.query(
        `INSERT INTO admin_users (email, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash`,
        [email, passwordHash],
      );
    } finally {
      await pool.end();
    }
  }

  console.log(`Admin credentials saved for ${email}.`);
}

createAdmin().catch((error) => {
  console.error(`Unable to create admin: ${error.message}`);
  process.exitCode = 1;
});
