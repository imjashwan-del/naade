const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres.wmpsecuvsvtgbsutmeyr:Jashwan%40091203@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

async function run() {
  console.log("Connecting to Supabase...");
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log("Connected to Supabase PostgreSQL successfully!");

    console.log("Applying schema migrations...");

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "password_hash" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "orders" (
        "id" serial PRIMARY KEY NOT NULL,
        "order_number" text NOT NULL UNIQUE,
        "customer_name" text NOT NULL,
        "email" text NOT NULL,
        "phone" text NOT NULL,
        "address" text NOT NULL,
        "city" text NOT NULL,
        "state" text NOT NULL,
        "pincode" text NOT NULL,
        "subtotal" integer NOT NULL,
        "shipping" integer DEFAULT 0 NOT NULL,
        "total" integer NOT NULL,
        "payment_status" text DEFAULT 'PENDING' NOT NULL,
        "order_status" text DEFAULT 'PENDING' NOT NULL,
        "razorpay_order_id" text,
        "razorpay_payment_id" text,
        "razorpay_signature" text,
        "tracking_carrier" text,
        "tracking_number" text,
        "tracking_url" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" serial PRIMARY KEY NOT NULL,
        "order_id" integer NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" integer,
        "product_name" text NOT NULL,
        "category" text DEFAULT '' NOT NULL,
        "price" integer NOT NULL,
        "quantity" integer DEFAULT 1 NOT NULL,
        "size" text,
        "is_made_to_measure" boolean DEFAULT false NOT NULL,
        "measurements" jsonb,
        "image_url" text DEFAULT '' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "products" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "category" text NOT NULL,
        "description" text DEFAULT '' NOT NULL,
        "price" integer NOT NULL,
        "product_code" text NOT NULL,
        "cloth_name" text DEFAULT '' NOT NULL,
        "weave_type" text DEFAULT '' NOT NULL,
        "colour_story" text DEFAULT '' NOT NULL,
        "craft_story" text DEFAULT '' NOT NULL,
        "main_image_url" text DEFAULT '' NOT NULL,
        "gallery_images" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "images" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "product_video_url" text,
        "available_sizes" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "custom_measurements_enabled" boolean DEFAULT false NOT NULL,
        "inventory_quantity" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "is_featured" boolean DEFAULT false NOT NULL,
        "is_new_arrival" boolean DEFAULT false NOT NULL,
        "sort_order" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "admin_login_attempts" (
        "key" text PRIMARY KEY NOT NULL,
        "attempts" integer DEFAULT 0 NOT NULL,
        "window_started" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "site_content" (
        "page_id" text PRIMARY KEY NOT NULL,
        "content" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("Schema created successfully.");

    // Seed Admin User
    console.log("Seeding admin user...");
    await client.query(`
      INSERT INTO admin_users (email, password_hash)
      VALUES ('imjashwan@gmail.com', '$2b$12$QmjhISp7HKLEYdG56Q8C6OboR/s9DmDJbB8DEDxpx1J0HclT4qtOG')
      ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash;
    `);
    console.log("Admin user seeded.");

    // Seed Site Content
    console.log("Seeding site content...");
    const content = {
      heroImage: "/images/hero%20copy.jpg",
      heroTitle: "THE IKAT OF \nPOCHAMPALLY\n",
      weaveCopy: "Pochampally Ikat is created by resist-dyeing yarns before weaving, allowing the pattern to emerge through the structure of the cloth itself.",
      shirtsCopy: "Modern silhouettes woven in Ikat.",
      weaveImage: "/images/weave-texture.jpg",
      weaveTitle: "The Weave",
      heroEyebrow: "NAADE",
      jacketsCopy: "Contemporary jackets crafted from Pochampally Ikat.",
      measureCopy: "Selected NAADE pieces can be made using your measurements for a more personal fit.",
      shirtsImage: "/images/category-shirts.jpg",
      shirtsTitle: "Shirts",
      featuredCopy: "PREMIUM IKAT COTTON CLOTH MENS COLLECTION",
      heroImageAlt: "Handwoven Pochampally Ikat cloth on a traditional loom",
      jacketsImage: "/images/category-jackets.jpg",
      jacketsTitle: "Jackets",
      measureImage: "/images/made-to-measure.jpg",
      measureTitle: "Your fit.\nYour NAADE.",
      weaveEyebrow: "Craft",
      featuredTitle: "The Collection",
      measureButton: "Explore Made to Measure",
      viewAllButton: "View All Products",
      weaveImageAlt: "Close-up of handwoven Pochampally Ikat textile",
      measureEyebrow: "Made to Measure",
      featuredEyebrow: "Featured",
      heroDescription: "Modern menswear crafted from Pochampally Ikat.",
      measureImageAlt: "Tailor taking measurements for a made-to-measure NAADE garment",
      heroShirtsButton: "Shop Shirts",
      heroJacketsButton: "Shop Jackets"
    };

    await client.query(`
      INSERT INTO site_content (page_id, content, updated_at)
      VALUES ('home', $1, NOW())
      ON CONFLICT (page_id) DO UPDATE
      SET content = EXCLUDED.content, updated_at = NOW();
    `, [JSON.stringify(content)]);
    console.log("Site content seeded.");

    // Check counts
    const adminCount = await client.query("SELECT COUNT(*) FROM admin_users;");
    const siteContentCount = await client.query("SELECT COUNT(*) FROM site_content;");
    console.log("Total Admin Users:", adminCount.rows[0].count);
    console.log("Total Site Content rows:", siteContentCount.rows[0].count);

    client.release();
    console.log("Migration and seeding complete!");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
