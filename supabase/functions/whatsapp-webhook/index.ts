import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  sendWhatsAppTextMessage,
  sendWhatsAppImageMessage,
  type WhatsAppConfig,
} from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hub-signature-256",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Normalizes Indian phone numbers to comparable digits (e.g. "918555909550" or "8555909550").
 */
function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  // If 12 digits starting with 91, extract last 10
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  // If 11 digits starting with 0, extract last 10
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Extracts NAADE order reference from message text.
 * Matches patterns like "NAADE-MV6S4BEI-5678" or "NAADE-XXXXX".
 */
function extractOrderReference(text: string): string | null {
  const match = text.match(/NAADE-[A-Z0-9]+-[0-9]+/i) || text.match(/NAADE-[A-Z0-9-]+/i);
  return match ? match[0].toUpperCase().trim() : null;
}

/**
 * Validates Meta webhook HMAC-SHA256 signature using Web Crypto API.
 */
async function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): Promise<boolean> {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=") || !appSecret) {
    return false;
  }
  const expectedSig = signatureHeader.slice(7);

  const encoder = new TextEncoder();
  const keyData = encoder.encode(appSecret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(rawBody)
  );

  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const calculatedSig = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  // Constant-time comparison
  if (expectedSig.length !== calculatedSig.length) return false;
  let result = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    result |= expectedSig.charCodeAt(i) ^ calculatedSig.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // 2. Meta Webhook Verification (GET request)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const configuredVerifyToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token === configuredVerifyToken && challenge) {
      console.log("[webhook] Meta verification challenge successful");
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.warn("[webhook] Meta verification token mismatch or invalid mode");
    return new Response("Forbidden", { status: 403 });
  }

  // Only POST is accepted for incoming events
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // 3. Signature verification
  const rawBody = await req.text();
  const appSecret = Deno.env.get("WHATSAPP_APP_SECRET");

  if (appSecret) {
    const signatureHeader = req.headers.get("x-hub-signature-256");
    const isValid = await verifyMetaSignature(rawBody, signatureHeader, appSecret);
    if (!isValid) {
      console.error("[webhook] Invalid Meta X-Hub-Signature-256 header");
      return jsonResponse({ error: "Invalid signature" }, 401);
    }
  } else {
    console.warn("[webhook] WHATSAPP_APP_SECRET not set; signature verification bypassed");
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  // 4. Initialize Supabase Admin client
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    console.error("[webhook] Supabase environment variables not configured");
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 5. WhatsApp API credentials
  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN") || "";
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") || "";
  const apiVersion = Deno.env.get("WHATSAPP_API_VERSION") || "v21.0";
  const paymentQrUrl = Deno.env.get("NAADE_PAYMENT_QR_URL");
  const upiId = Deno.env.get("NAADE_UPI_ID");

  const whatsappConfig: WhatsAppConfig = {
    accessToken,
    phoneNumberId,
    apiVersion,
  };

  // 6. Extract Meta WhatsApp entries
  const entries = Array.isArray(body?.entry) ? (body.entry as Record<string, unknown>[]) : [];

  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes)
      ? (entry.changes as Record<string, unknown>[])
      : [];

    for (const change of changes) {
      const value = (change?.value && typeof change.value === "object"
        ? change.value
        : {}) as Record<string, unknown>;

      const messages = Array.isArray(value?.messages)
        ? (value.messages as Record<string, unknown>[])
        : [];

      for (const msg of messages) {
        const messageId = String(msg.id || "");
        const fromNumber = String(msg.from || "");
        const messageType = String(msg.type || "");

        // Only process text messages; ignore status receipts and reactions safely
        if (messageType !== "text" || !messageId || !fromNumber) {
          continue;
        }

        const textObj = (msg.text && typeof msg.text === "object"
          ? msg.text
          : {}) as Record<string, unknown>;
        const messageText = String(textObj?.body || "").trim();

        // Idempotency: Check if this Meta message ID was already processed
        const { data: existingEvent } = await supabase
          .from("whatsapp_webhook_events")
          .select("id")
          .eq("meta_message_id", messageId)
          .maybeSingle();

        if (existingEvent) {
          console.log(`[webhook] Message ${messageId} already processed. Skipping.`);
          continue;
        }

        // Record event into idempotency table immediately
        await supabase.from("whatsapp_webhook_events").insert({
          meta_message_id: messageId,
          sender_phone: fromNumber,
          event_type: "message",
          payload: { text: messageText, timestamp: msg.timestamp },
        });

        // 7. Extract and verify order
        const orderRef = extractOrderReference(messageText);

        if (!orderRef) {
          // Message doesn't contain a recognized order reference
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body:
                "Hello! Thank you for reaching out to NAADE.\n\nTo complete an order, please send your NAADE Order ID (e.g. NAADE-XXXX-XXXX). If you have questions, our team will assist you shortly.",
            });
          }
          continue;
        }

        // Fetch order from database
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("id, order_number, customer_name, phone, total, payment_status, order_status")
          .eq("order_number", orderRef)
          .maybeSingle();

        if (orderError || !order) {
          console.warn(`[webhook] Order reference ${orderRef} not found in database.`);
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body:
                "Hello from NAADE.\n\nWe couldn't locate an order with reference: " +
                orderRef +
                ". Please verify your Order ID from checkout or contact hello@naade.in for assistance.",
            });
          }
          continue;
        }

        // Privacy check: Verify sender phone against stored order customer phone
        const normalizedSender = normalizePhone(fromNumber);
        const normalizedOrderPhone = normalizePhone(order.phone);

        if (
          normalizedSender &&
          normalizedOrderPhone &&
          normalizedSender !== normalizedOrderPhone
        ) {
          console.warn(
            `[webhook] Privacy mismatch: sender phone ${normalizedSender} does not match order phone ${normalizedOrderPhone}`
          );
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body:
                "Hello from NAADE.\n\nFor your security, we can only confirm orders from the contact number provided at checkout. Please message us from your registered checkout phone number.",
            });
          }
          continue;
        }

        // Check if order is already paid
        if (order.payment_status === "PAID" || order.payment_status === "paid") {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body: `Hello ${order.customer_name},\n\nYour order *${order.order_number}* is already confirmed and paid! We are preparing your handwoven pieces. For status updates, feel free to reply here.`,
            });
          }
          continue;
        }

        // Check if order is cancelled
        if (order.order_status === "CANCELLED" || order.order_status === "cancelled") {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body: `Hello ${order.customer_name},\n\nOrder *${order.order_number}* has been cancelled and cannot accept payment. Please visit https://naade.vercel.app to create a new order.`,
            });
          }
          continue;
        }

        // 8. Send Verified Order Confirmation & Payment Instructions
        const formattedAmount = `₹${Number(order.total).toLocaleString("en-IN")}`;

        if (paymentQrUrl) {
          // Send official payment QR image with caption
          const caption = [
            `*NAADE Order Confirmation*`,
            ``,
            `Order ID: ${order.order_number}`,
            `Amount to Pay: ${formattedAmount}`,
            ``,
            upiId ? `UPI ID: ${upiId}` : "",
            `Scan the QR code above or pay using your UPI app. Once paid, please share a screenshot of the payment confirmation here.`,
            ``,
            `Thank you for choosing NAADE!`,
          ]
            .filter(Boolean)
            .join("\n");

          try {
            await sendWhatsAppImageMessage(whatsappConfig, {
              to: fromNumber,
              imageUrl: paymentQrUrl,
              caption,
            });
          } catch (imgError) {
            console.error("[webhook] Error sending QR image, sending text fallback:", imgError);
            // Fallback to text instructions if image fails
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body: [
                `*NAADE Order Confirmation*`,
                ``,
                `Order ID: ${order.order_number}`,
                `Amount to Pay: ${formattedAmount}`,
                ``,
                upiId ? `UPI ID: ${upiId}` : "",
                `Please complete your payment via UPI and share the payment confirmation screenshot here to confirm your order.`,
              ]
                .filter(Boolean)
                .join("\n"),
            });
          }
        } else {
          // No QR configured: Send professional text payment instructions safely
          const message = [
            `*NAADE Order Received*`,
            ``,
            `Hello ${order.customer_name},`,
            `We have verified your order *${order.order_number}* for ${formattedAmount}.`,
            ``,
            upiId
              ? `UPI ID: ${upiId}\nPlease transfer ${formattedAmount} to the UPI ID above.`
              : `Our team will share the verified payment instructions shortly.`,
            ``,
            `Once paid, kindly reply with the transaction screenshot.`,
          ]
            .filter(Boolean)
            .join("\n");

          await sendWhatsAppTextMessage(whatsappConfig, {
            to: fromNumber,
            body: message,
          });
        }

        // Update order record with whatsapp notification timestamp
        await supabase
          .from("orders")
          .update({
            whatsapp_notified_at: new Date().toISOString(),
            whatsapp_phone: fromNumber,
          })
          .eq("id", order.id);

        console.log(`[webhook] Successfully replied for order ${order.order_number} to ${fromNumber}`);
      }
    }
  }

  // Acknowledge Meta within 20 seconds as required by Graph API
  return jsonResponse({ status: "EVENT_RECEIVED" });
});
