// scripts/migrate-phonepe.cjs
// Applies the PhonePe schema migration: drops razorpay columns, adds phone_pe_transaction_id
require("dotenv").config({ path: ".env.local" });

const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected to database.");

  // Check which columns currently exist
  const { rows } = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'orders'
    ORDER BY ordinal_position;
  `);
  const cols = rows.map((r) => r.column_name);
  console.log("Current orders columns:", cols.join(", "));

  const stmts = [];

  if (!cols.includes("phone_pe_transaction_id")) {
    stmts.push(
      `ALTER TABLE orders ADD COLUMN phone_pe_transaction_id TEXT;`,
    );
    console.log("→ Will ADD column: phone_pe_transaction_id");
  } else {
    console.log("✓ Column phone_pe_transaction_id already exists, skipping.");
  }

  if (cols.includes("razorpay_order_id")) {
    stmts.push(`ALTER TABLE orders DROP COLUMN razorpay_order_id;`);
    console.log("→ Will DROP column: razorpay_order_id");
  }
  if (cols.includes("razorpay_payment_id")) {
    stmts.push(`ALTER TABLE orders DROP COLUMN razorpay_payment_id;`);
    console.log("→ Will DROP column: razorpay_payment_id");
  }
  if (cols.includes("razorpay_signature")) {
    stmts.push(`ALTER TABLE orders DROP COLUMN razorpay_signature;`);
    console.log("→ Will DROP column: razorpay_signature");
  }

  if (stmts.length === 0) {
    console.log("Nothing to migrate.");
    await client.end();
    return;
  }

  for (const sql of stmts) {
    console.log("Executing:", sql);
    await client.query(sql);
  }

  console.log("\n✅ Migration complete!");
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
