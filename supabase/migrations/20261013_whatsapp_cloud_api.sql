-- Migration: WhatsApp Cloud API Integration (Idempotency and Security)
-- 1. Create table to track processed incoming WhatsApp message IDs to prevent duplicates
CREATE TABLE IF NOT EXISTS "whatsapp_webhook_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "meta_message_id" text NOT NULL UNIQUE,
  "sender_phone" text NOT NULL,
  "order_number" text,
  "event_type" text NOT NULL DEFAULT 'message',
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "processed_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Index for speedy idempotency checks
CREATE INDEX IF NOT EXISTS "idx_whatsapp_events_meta_msg_id" ON "whatsapp_webhook_events" ("meta_message_id");
CREATE INDEX IF NOT EXISTS "idx_whatsapp_events_sender_phone" ON "whatsapp_webhook_events" ("sender_phone");

-- 2. Ensure orders table has index on order_number and phone for fast verification
CREATE INDEX IF NOT EXISTS "idx_orders_order_number" ON "orders" ("order_number");
CREATE INDEX IF NOT EXISTS "idx_orders_phone" ON "orders" ("phone");

-- 3. Track WhatsApp notification timestamps on orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "whatsapp_notified_at" timestamp with time zone;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "whatsapp_phone" text;

COMMENT ON TABLE "whatsapp_webhook_events" IS 'Stores processed incoming Meta WhatsApp messages for idempotency and security audit.';
