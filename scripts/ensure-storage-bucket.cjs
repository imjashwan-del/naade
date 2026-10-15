const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres.wmpsecuvsvtgbsutmeyr:Jashwan%40091203@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

async function main() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
    console.log(`Checking storage bucket '${bucket}'...`);

    await pool.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        $1,
        $1,
        true,
        8388608,
        ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      )
      ON CONFLICT (id) DO UPDATE SET
        public = true,
        file_size_limit = 8388608,
        allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    `, [bucket]);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'storage' 
            AND tablename = 'objects' 
            AND policyname = 'Public Access for product-images'
        ) THEN
          CREATE POLICY "Public Access for product-images"
          ON storage.objects FOR SELECT
          USING (bucket_id = 'product-images');
        END IF;
      END $$;
    `);

    const res = await pool.query("SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = $1;", [bucket]);
    console.log("Bucket configured successfully:", res.rows[0]);
  } catch (err) {
    console.error("Failed to configure storage bucket:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
