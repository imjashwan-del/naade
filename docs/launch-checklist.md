# Launch Checklist

## Production Database

- Do not deploy the local PGlite data directory. Set `LOCAL_PGLITE=0` and provide a managed PostgreSQL `DATABASE_URL`.
- Generate schema migrations with `npm run db:generate`; apply them to PostgreSQL with `npm run db:push` before deploying.
- Configure automated database backups with the selected database provider and test a restore.
- Set a unique `ADMIN_SESSION_SECRET` and strong admin password in the production environment.

## Product Image Storage

- Create a public Supabase Storage bucket named by `SUPABASE_STORAGE_BUCKET` (default `product-images`).
- Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the server environment. Never expose the service-role key to the browser.
- Local development falls back to `public/uploads`; production uploads fail closed if Supabase Storage is not configured.
- Replace the demo product photos and descriptions with approved product assets and accurate inventory before launch.

## Email And Domain

- Verify a sending domain with Resend, then configure `RESEND_API_KEY` and `ORDER_EMAIL_FROM`.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS domain. It is used for metadata, sitemap URLs, and robots declarations.
- Order-status emails are sent when staff change an order's fulfilment status; without Resend settings, order updates still save but no email is sent.

## Release Checks

- Configure Razorpay test/live keys separately; this project intentionally requires online payment and has no cash-on-delivery path.
- Test checkout success, failure, cancellation, stock updates, shipment tracking, and customer email delivery in the payment provider's test mode.
- Confirm privacy, terms, shipping, returns, GST/invoice details, and customer support contacts match the business before launch.
- Run `npm run typecheck`, `npm run lint`, and `npm run build`; review production logs and confirm the health endpoint before accepting orders.