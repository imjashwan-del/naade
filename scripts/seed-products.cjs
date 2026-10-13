const path = require("node:path");
const { PGlite } = require("@electric-sql/pglite");

async function seed() {
  const dataDir = path.resolve(".data/postgres");
  const pg = new PGlite(dataDir);

  const products = [
    {
      name: "NAADE Jacket 001",
      slug: "naade-jacket-001",
      category: "jacket",
      description: "A tailored single-breasted jacket cut from handwoven Pochampally Ikat, built for the contemporary wardrobe.",
      price: 14999,
      product_code: "NJ001",
      cloth_name: "Pochampally Ikat Cotton",
      weave_type: "Single Ikat, Hand-dyed & Handwoven",
      colour_story: "Charcoal ground with a muted indigo geometric weave",
      craft_story: "Woven by master artisans in Pochampally, Telangana, using resist-dyed yarns so the pattern emerges from the structure of the cloth.",
      main_image_url: "/images/product-jacket-001.jpg",
      gallery_images: JSON.stringify(["/images/product-jacket-001.jpg", "/images/weave-texture.jpg"]),
      images: JSON.stringify(["/images/product-jacket-001.jpg", "/images/weave-texture.jpg"]),
      available_sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      custom_measurements_enabled: true,
      inventory_quantity: 12,
      is_active: true,
      is_featured: true,
      is_new_arrival: true,
      sort_order: 1,
    },
    {
      name: "NAADE Jacket 002",
      slug: "naade-jacket-002",
      category: "jacket",
      description: "An unstructured Nehru jacket in deep maroon Ikat, designed for evening wear with a modern silhouette.",
      price: 16999,
      product_code: "NJ002",
      cloth_name: "Pochampally Ikat Silk Blend",
      weave_type: "Double Ikat, Hand-dyed & Handwoven",
      colour_story: "Deep maroon with earthy brown accents",
      craft_story: "Each length of cloth takes weeks to dye and weave, with patterns aligned by hand before the loom.",
      main_image_url: "/images/product-jacket-002.jpg",
      gallery_images: JSON.stringify(["/images/product-jacket-002.jpg", "/images/weave-texture.jpg"]),
      images: JSON.stringify(["/images/product-jacket-002.jpg", "/images/weave-texture.jpg"]),
      available_sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      custom_measurements_enabled: true,
      inventory_quantity: 8,
      is_active: true,
      is_featured: true,
      is_new_arrival: false,
      sort_order: 2,
    },
    {
      name: "NAADE Shirt 001",
      slug: "naade-shirt-001",
      category: "shirt",
      description: "A relaxed-fit shirt in soft Ikat cotton, cut for warm-weather layering with a clean point collar.",
      price: 7999,
      product_code: "NS001",
      cloth_name: "Pochampally Ikat Cotton",
      weave_type: "Single Ikat, Handwoven",
      colour_story: "Warm ivory with muted indigo detailing",
      craft_story: "Woven on traditional pit looms by families who have practiced Ikat dyeing for generations.",
      main_image_url: "/images/product-shirt-001.jpg",
      gallery_images: JSON.stringify(["/images/product-shirt-001.jpg", "/images/weave-texture.jpg"]),
      images: JSON.stringify(["/images/product-shirt-001.jpg", "/images/weave-texture.jpg"]),
      available_sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      custom_measurements_enabled: true,
      inventory_quantity: 20,
      is_active: true,
      is_featured: true,
      is_new_arrival: true,
      sort_order: 3,
    },
    {
      name: "NAADE Shirt 002",
      slug: "naade-shirt-002",
      category: "shirt",
      description: "A slim, modern shirt in charcoal Ikat, finished with mother-of-pearl buttons and a tailored back yoke.",
      price: 8999,
      product_code: "NS002",
      cloth_name: "Pochampally Ikat Cotton",
      weave_type: "Single Ikat, Handwoven",
      colour_story: "Charcoal and natural white",
      craft_story: "Precision hand-tying creates crisp diamond motifs unique to the Pochampally cluster.",
      main_image_url: "/images/product-shirt-002.jpg",
      gallery_images: JSON.stringify(["/images/product-shirt-002.jpg", "/images/weave-texture.jpg"]),
      images: JSON.stringify(["/images/product-shirt-002.jpg", "/images/weave-texture.jpg"]),
      available_sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      custom_measurements_enabled: true,
      inventory_quantity: 15,
      is_active: true,
      is_featured: true,
      is_new_arrival: false,
      sort_order: 4,
    },
  ];

  for (const p of products) {
    await pg.query(
      `INSERT INTO products (
        name, slug, category, description, price, product_code, cloth_name, weave_type,
        colour_story, craft_story, main_image_url, gallery_images, images, available_sizes,
        custom_measurements_enabled, inventory_quantity, is_active, is_featured, is_new_arrival, sort_order
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;`,
      [
        p.name, p.slug, p.category, p.description, p.price, p.product_code, p.cloth_name, p.weave_type,
        p.colour_story, p.craft_story, p.main_image_url, p.gallery_images, p.images, p.available_sizes,
        p.custom_measurements_enabled, p.inventory_quantity, p.is_active, p.is_featured, p.is_new_arrival, p.sort_order
      ]
    );
  }

  const res = await pg.query("SELECT count(*) FROM products;");
  console.log("Successfully seeded products into local DB. Total count:", res.rows[0].count);
}

seed().catch(console.error);
