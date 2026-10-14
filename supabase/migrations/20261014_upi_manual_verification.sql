-- Migration: Direct UPI Payment With Manual Verification
-- 1. Create payment_attempts table for unverified customer payment attempts
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

CREATE INDEX IF NOT EXISTS "idx_payment_attempts_order_ref" ON "payment_attempts" ("order_reference");
CREATE INDEX IF NOT EXISTS "idx_payment_attempts_status" ON "payment_attempts" ("status");
CREATE INDEX IF NOT EXISTS "idx_payment_attempts_phone" ON "payment_attempts" ("phone");

-- 2. Create audit log table for admin verification actions
CREATE TABLE IF NOT EXISTS "payment_verification_audit_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "payment_attempt_id" integer NOT NULL REFERENCES "payment_attempts"("id") ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS "idx_audit_logs_order_ref" ON "payment_verification_audit_logs" ("order_reference");

-- 3. Enhance orders table with manual verification tracking
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_attempt_id" integer;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "verified_transaction_reference" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "verified_at" timestamp with time zone;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "verified_by_admin_email" text;
