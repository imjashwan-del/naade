# NAADE — WhatsApp Cloud API Automation Setup Guide

This guide walks you through connecting your dedicated phone number (`+91 8555909550`) to Meta's official WhatsApp Cloud API and deploying the Supabase Edge Functions for automated order confirmation and UPI payment collection.

---

## Architecture Overview

```
Customer Checkout on NAADE
      │
      ▼
1. Orders recorded in Supabase PostgreSQL
      │
      ▼
2. Customer taps "Complete Order on WhatsApp" (prefilled message with Order ID)
      │
      ▼
3. Customer sends message on WhatsApp to NAADE dedicated business number
      │
      ▼
4. Meta delivers Webhook to Supabase Edge Function (`whatsapp-webhook`)
      │
      ▼
5. Edge Function verifies Meta signature (`X-Hub-Signature-256`)
   Checks idempotency (`whatsapp_webhook_events`)
   Validates order reference & matches customer phone number
      │
      ▼
6. Edge Function auto-replies via Graph API with:
   - Order confirmation & exact verified total
   - Official UPI QR image (`NAADE_PAYMENT_QR_URL`)
   - Payment completion instructions
```

---

## Step 1: Meta Developer Portal Setup

1. Open [Meta for Developers](https://developers.facebook.com/) and log in.
2. Click **My Apps** → **Create App**.
3. Select **Other** as the use case → Next.
4. Select **Business** as the app type → Next.
5. Provide your app details:
   - **App Name**: `NAADE Orders`
   - **App Contact Email**: Your business email
   - Connect to your Meta Business Account portfolio if available.
6. Click **Create App**.

---

## Step 2: Add the WhatsApp Product

1. On your App Dashboard, find **WhatsApp** and click **Set up**.
2. Go to **WhatsApp** → **API Setup** in the left sidebar.
3. You will see:
   - **Temporary access token** (for initial testing)
   - **Phone number ID**
   - **WhatsApp Business Account ID**

---

## Step 3: Register Your Dedicated Phone Number

> ⚠️ **Important**: The phone number you use for WhatsApp Cloud API cannot be actively registered on the standard consumer WhatsApp or WhatsApp Business mobile app at the same time. If it is currently on your phone, delete the WhatsApp account from WhatsApp Settings → Account → Delete Account before registering it here.

1. Under **API Setup**, navigate to **Step 5: Add a phone number**.
2. Click **Add phone number**.
3. Provide your Business Display Name: `NAADE`
4. Select Category: `Clothing & Apparel`
5. Enter your dedicated number: `+91 8555909550`.
6. Verify the number via SMS or Voice code.
7. Note down your production **Phone number ID**.

---

## Step 4: Create a Permanent System User Access Token

*Temporary tokens expire after 24 hours. For production, create a permanent System User token:*

1. Open [Meta Business Suite](https://business.facebook.com/settings).
2. Go to **Business Settings** → **Users** → **System Users**.
3. Click **Add**, name it `naade-whatsapp-bot`, and select role **Admin**.
4. Click **Generate Token** under the newly created system user:
   - Select your NAADE App.
   - Select permissions:
     - `whatsapp_business_management`
     - `whatsapp_business_messaging`
5. Set Token Expiration to **Never / Permanent**.
6. Copy the generated access token securely.

---

## Step 5: Configure Supabase Database & Secrets

### A. Run Database Migration
Open your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** → **New Query**, paste the contents of `supabase/migrations/20261013_whatsapp_cloud_api.sql` and run it:
- Creates `whatsapp_webhook_events` table for duplicate prevention (idempotency).
- Adds necessary indexes and tracking columns to `orders`.

### B. Configure Edge Function Secrets
In your local terminal (or via Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**), set:

```powershell
# In c:\Users\lenovo\Downloads\IKAT web22
npx supabase secrets set `
  WHATSAPP_ACCESS_TOKEN="your_permanent_system_user_token" `
  WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id" `
  WHATSAPP_BUSINESS_ACCOUNT_ID="your_business_account_id" `
  WHATSAPP_APP_SECRET="your_meta_app_secret" `
  WHATSAPP_VERIFY_TOKEN="create_a_strong_random_secret_string" `
  WHATSAPP_API_VERSION="v21.0" `
  NAADE_PAYMENT_QR_URL="https://naade.vercel.app/images/payment-qr.jpg" `
  NAADE_UPI_ID="your_business_upi_id@bank"
```

*Find `WHATSAPP_APP_SECRET` in Meta for Developers → App settings → Basic → App Secret.*

---

## Step 6: Deploy Supabase Edge Functions

Run the following commands using the Supabase CLI:

```powershell
# 1. Login to Supabase
npx supabase login

# 2. Link your Supabase project (project ref: wmpsecuvsvtgbsutmeyr)
npx supabase link --project-ref wmpsecuvsvtgbsutmeyr

# 3. Deploy functions
npx supabase functions deploy whatsapp-webhook --no-verify-jwt
npx supabase functions deploy whatsapp-send
```

Your webhook URL will be:
```
https://wmpsecuvsvtgbsutmeyr.supabase.co/functions/v1/whatsapp-webhook
```

---

## Step 7: Configure Meta Webhook

1. In Meta for Developers, go to **WhatsApp** → **Configuration** in the left sidebar.
2. In the **Webhook** section, click **Edit**:
   - **Callback URL**: `https://wmpsecuvsvtgbsutmeyr.supabase.co/functions/v1/whatsapp-webhook`
   - **Verify Token**: The exact value you set for `WHATSAPP_VERIFY_TOKEN`.
3. Click **Verify and save**.
4. In **Webhook fields**, click **Manage** and subscribe to **`messages`**.

---

## Step 8: End-to-End Verification

1. Place an order on [https://naade.vercel.app/checkout](https://naade.vercel.app/checkout).
2. Tap **Complete Order on WhatsApp**.
3. Send the prefilled message with your `Order ID` to your NAADE WhatsApp number.
4. Confirm that:
   - The bot responds instantly with order confirmation and the UPI QR image.
   - Sending the same message twice does not result in duplicate replies (checked via `whatsapp_webhook_events`).
   - Messaging from an unrelated phone number returns a security notice without disclosing order info.
5. In your admin panel at `/admin/orders`, verify the payment status after checking your bank/UPI transaction.
