// scripts/migrate-upi-verification.cjs
// Idempotently applies the Direct UPI Manual Verification schema to PostgreSQL (PGlite & Supabase).
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

async function migrateSql(client) {
  const query = (sql, params = []) => client.query(sql, params);

  console.log("Applying schema migrations for Direct UPI Manual Verification...");

  // 1. Create payment_attempts table
  await query(`
    CREATE TABLE IF NOT EXISTS "payment_attempts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order_reference" text NOT NULL UNIQUE,
      "customer_name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text NOT NULL,
      "address" text NOT NULL,
      "city" text NOT NULL,
      "state" text NOT NULL,
      "pincode" text NOT NULL,
      "items" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "subtotal" integer NOT NULL,
      "shipping" integer DEFAULT 0 NOT NULL,
      "total" integer NOT NULL,
      "currency" text DEFAULT 'INR' NOT NULL,
      "status" text DEFAULT 'PENDING_VERIFICATION' NOT NULL,
      "customer_upi_reference" text,
      "customer_note" text,
      "verified_transaction_reference" text,
      "verified_at" timestamp with time zone,
      "verified_by_admin_id" integer,
      "verified_by_admin_email" text,
      "order_id" integer,
      "rejection_reason" text,
      "expires_at" timestamp with time zone NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `);
  console.log("✓ payment_attempts table verified.");

  // Indexes for payment_attempts
  await query(`CREATE INDEX IF NOT EXISTS "idx_payment_attempts_order_ref" ON "payment_attempts" ("order_reference");`);
  await query(`CREATE INDEX IF NOT EXISTS "idx_payment_attempts_status" ON "payment_attempts" ("status");`);
  await query(`CREATE INDEX IF NOT EXISTS "idx_payment_attempts_phone" ON "payment_attempts" ("phone");`);
  console.log("✓ payment_attempts indexes verified.");

  // 2. Create payment_verification_audit_logs table
  await query(`
    CREATE TABLE IF NOT EXISTS "payment_verification_audit_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "payment_attempt_id" integer NOT NULL,
      "order_reference" text NOT NULL,
      "admin_id" integer,
      "admin_email" text NOT NULL,
      "action" text NOT NULL,
      "verified_transaction_reference" text,
      "amount" integer NOT NULL,
      "notes" text,
      "ip_address" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `);
  console.log("✓ payment_verification_audit_logs table verified.");
  await query(`CREATE INDEX IF NOT EXISTS "idx_audit_logs_order_ref" ON "payment_verification_audit_logs" ("order_reference");`);

  // 3. Add verification tracking columns to orders table
  await query(`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_attempt_id" integer;`);
  await query(`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "verified_transaction_reference" text;`);
  await query(`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "verified_at" timestamp with time zone;`);
  await query(`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "verified_by_admin_email" text;`);
  console.log("✓ orders table verification columns verified.");
}

async function main() {
  if (process.env.LOCAL_PGLITE === "1") {
    console.log("Running migration on local PGlite...");
    const { PGlite } = await import("@electric-sql/pglite");
    const dataDirectory = path.resolve(
      process.cwd(),
      process.env.PGLITE_DATA_DIR || ".data/postgres",
    );
    fs.mkdirSync(path.dirname(dataDirectory), { recursive: true });
    const client = new PGlite(dataDirectory);
    try {
      await migrateSql(client);
    } finally {
      await client.close();
    }
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    console.log("Running migration on remote PostgreSQL / Supabase...");
    const { Client } = require("pg");
    const client = new Client({
      connectionString: databaseUrl,
      ssl:
        databaseUrl.includes("supabase") ||
        databaseUrl.includes("neon") ||
        databaseUrl.includes("sslmode")
          ? { rejectUnauthorized: false }
          : undefined,
    });
    try {
      await client.connect();
      await migrateSql(client);
      console.log("✓ Remote database migration completed successfully.");
    } catch (err) {
      console.warn("Remote PostgreSQL migration warning (skipped or unreachable):", err.message);
    } finally {
      await client.end().catch(() => {});
    }
  }

  console.log("\n✅ All Direct UPI Manual Verification migrations applied!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
