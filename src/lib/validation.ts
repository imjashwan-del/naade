import { z } from "zod";

export const measurementsSchema = z.object({
  chest: z.string().min(1),
  waist: z.string().min(1),
  shoulder: z.string().min(1),
  sleeveLength: z.string().min(1),
  garmentLength: z.string().min(1),
  neck: z.string().min(1),
});

export const cartItemSchema = z.object({
  cartItemId: z.string(),
  productId: z.number().int(),
  slug: z.string(),

  name: z.string().min(1),
  category: z.string(),
  price: z.number().positive(),
  imageUrl: z.string(),
  size: z.string().nullable(),
  isMadeToMeasure: z.boolean(),
  measurements: measurementsSchema.nullable(),
  quantity: z.number().int().min(1).max(99),
});

export const customerInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(4, "Enter a valid pincode"),
});

export const createOrderSchema = z.object({
  customer: customerInfoSchema,
  items: z.array(cartItemSchema).min(1, "Your bag is empty"),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
