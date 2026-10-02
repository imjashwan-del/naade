CREATE TABLE "site_content" (
	"page_id" text PRIMARY KEY NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
