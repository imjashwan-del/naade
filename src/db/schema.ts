import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // "jacket" | "shirt"
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  productCode: text("product_code").notNull(),
  clothName: text("cloth_name").notNull().default(""),
  weaveType: text("weave_type").notNull().default(""),
  colourStory: text("colour_story").notNull().default(""),
  craftStory: text("craft_story").notNull().default(""),
  mainImageUrl: text("main_image_url").notNull().default(""),
  galleryImages: jsonb("gallery_images")
    .$type<string[]>()
    .notNull()
    .default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  productVideoUrl: text("product_video_url"),
  availableSizes: jsonb("available_sizes")
    .$type<string[]>()
    .notNull()
    .default([]),
  customMeasurementsEnabled: boolean("custom_measurements_enabled")
    .notNull()
    .default(false),
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  paymentStatus: text("payment_status").notNull().default("PENDING"),
  orderStatus: text("order_status").notNull().default("PENDING"),
  trackingCarrier: text("tracking_carrier"),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  phonePeTransactionId: text("phone_pe_transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItemMeasurements = {
  chest: string;
  waist: string;
  shoulder: string;
  sleeveLength: string;
  garmentLength: string;
  neck: string;
};

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  category: text("category").notNull().default(""),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  isMadeToMeasure: boolean("is_made_to_measure").notNull().default(false),
  measurements: jsonb("measurements").$type<OrderItemMeasurements | null>(),
  imageUrl: text("image_url").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

export const adminLoginAttempts = pgTable("admin_login_attempts", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(0),
  windowStarted: timestamp("window_started").notNull().defaultNow(),
});

export const siteContent = pgTable("site_content", {
  pageId: text("page_id").primaryKey(),
  content: jsonb("content")
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
