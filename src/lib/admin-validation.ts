import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  category: z.string().min(2),
  description: z.string().optional().default(""),
  price: z.number().int().positive(),
  productCode: z.string().min(1),
  clothName: z.string().optional().default(""),
  weaveType: z.string().optional().default(""),
  colourStory: z.string().optional().default(""),
  craftStory: z.string().optional().default(""),
  mainImageUrl: z.string().min(1),
  galleryImages: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  productVideoUrl: z.string().optional().nullable(),
  availableSizes: z.array(z.string()).optional().default([]),
  customMeasurementsEnabled: z.boolean().optional().default(false),
  inventoryQuantity: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const orderStatusValues = [
  "PENDING",
  "CONFIRMED",
  "IN PRODUCTION",
  "READY",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const paymentStatusValues = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
