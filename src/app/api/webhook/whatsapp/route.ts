import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, whatsappWebhookEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  sendWhatsAppTextMessage,
  sendWhatsAppImageMessage,
  type WhatsAppConfig,
} from "../../../../../supabase/functions/_shared/whatsapp";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

function extractOrderReference(text: string): string | null {
  const match = text.match(/NAADE-[A-Z0-9]+-[0-9]+/i) || text.match(/NAADE-[A-Z0-9-]+/i);
  return match ? match[0].toUpperCase().trim() : null;
}

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

  if (expectedSig.length !== calculatedSig.length) return false;
  let result = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    result |= expectedSig.charCodeAt(i) ^ calculatedSig.charCodeAt(i);
  }
  return result === 0;
}

// 1. Meta Webhook Verification (GET)
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const configuredVerifyToken =
    process.env.WHATSAPP_VERIFY_TOKEN || "naade_whatsapp_verify_token";

  if (mode === "subscribe" && token === configuredVerifyToken && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response("Forbidden", { status: 403 });
}

// 2. Incoming WhatsApp Message Handler (POST)
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (appSecret) {
    const signatureHeader = req.headers.get("x-hub-signature-256");
    const isValid = await verifyMetaSignature(rawBody, signatureHeader, appSecret);
    if (!isValid) {
      console.error("[whatsapp-webhook] Invalid Meta signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0";
  const paymentQrUrl = process.env.NAADE_PAYMENT_QR_URL;
  const upiId = process.env.NAADE_UPI_ID;

  const whatsappConfig: WhatsAppConfig = {
    accessToken,
    phoneNumberId,
    apiVersion,
  };

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

        if (messageType !== "text" || !messageId || !fromNumber) {
          continue;
        }

        const textObj = (msg.text && typeof msg.text === "object"
          ? msg.text
          : {}) as Record<string, unknown>;
        const messageText = String(textObj?.body || "").trim();

        // Idempotency: Check if message ID was already processed
        try {
          const existing = await db
            .select({ id: whatsappWebhookEvents.id })
            .from(whatsappWebhookEvents)
            .where(eq(whatsappWebhookEvents.metaMessageId, messageId))
            .limit(1);

          if (existing.length > 0) {
            console.log(`[whatsapp-webhook] Duplicate message ${messageId} ignored`);
            continue;
          }

          await db.insert(whatsappWebhookEvents).values({
            metaMessageId: messageId,
            senderPhone: fromNumber,
            eventType: "message",
            payload: { text: messageText, timestamp: msg.timestamp },
          });
        } catch (dbErr) {
          console.warn("[whatsapp-webhook] Idempotency table write skipped:", dbErr);
        }

        // Extract order reference
        const orderRef = extractOrderReference(messageText);

        if (!orderRef) {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body:
                "Hello! Thank you for reaching out to NAADE.\n\nTo complete your order, please send your NAADE Order ID (e.g. NAADE-XXXX-XXXX). Our team will assist you shortly.",
            }).catch(console.error);
          }
          continue;
        }

        // Fetch order details
        let orderRow: typeof orders.$inferSelect | null = null;
        try {
          const found = await db
            .select()
            .from(orders)
            .where(eq(orders.orderNumber, orderRef))
            .limit(1);
          orderRow = found[0] || null;
        } catch (dbErr) {
          console.error("[whatsapp-webhook] DB query error:", dbErr);
        }

        if (!orderRow) {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body:
                `Hello from NAADE.\n\nWe couldn't locate an order with reference: ${orderRef}. Please verify your Order ID or contact us at hello@naade.in.`,
            }).catch(console.error);
          }
          continue;
        }

        // Privacy check: Verify sender phone
        const normalizedSender = normalizePhone(fromNumber);
        const normalizedOrderPhone = normalizePhone(orderRow.phone);

        if (
          normalizedSender &&
          normalizedOrderPhone &&
          normalizedSender !== normalizedOrderPhone
        ) {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body:
                "Hello from NAADE.\n\nFor your security, we can only confirm orders from the contact number provided at checkout. Please message us from your registered phone number.",
            }).catch(console.error);
          }
          continue;
        }

        if (orderRow.paymentStatus === "PAID") {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body: `Hello ${orderRow.customerName},\n\nYour order *${orderRow.orderNumber}* is already confirmed and paid! We are preparing your handwoven pieces.`,
            }).catch(console.error);
          }
          continue;
        }

        if (orderRow.orderStatus === "CANCELLED") {
          if (accessToken && phoneNumberId) {
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body: `Hello ${orderRow.customerName},\n\nOrder *${orderRow.orderNumber}* has been cancelled and cannot accept payment.`,
            }).catch(console.error);
          }
          continue;
        }

        // Send order confirmation and UPI details
        const formattedAmount = `₹${Number(orderRow.total).toLocaleString("en-IN")}`;

        if (paymentQrUrl) {
          const caption = [
            `*NAADE Order Confirmation*`,
            ``,
            `Order ID: ${orderRow.orderNumber}`,
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
          } catch (imgErr) {
            console.error("[whatsapp-webhook] QR image send failed, sending text:", imgErr);
            await sendWhatsAppTextMessage(whatsappConfig, {
              to: fromNumber,
              body: [
                `*NAADE Order Confirmation*`,
                ``,
                `Order ID: ${orderRow.orderNumber}`,
                `Amount to Pay: ${formattedAmount}`,
                ``,
                upiId ? `UPI ID: ${upiId}` : "",
                `Please complete your payment via UPI and share the screenshot here.`,
              ]
                .filter(Boolean)
                .join("\n"),
            }).catch(console.error);
          }
        } else {
          const message = [
            `*NAADE Order Received*`,
            ``,
            `Hello ${orderRow.customerName},`,
            `We have verified your order *${orderRow.orderNumber}* for ${formattedAmount}.`,
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
          }).catch(console.error);
        }

        try {
          await db
            .update(orders)
            .set({
              whatsappNotifiedAt: new Date(),
              whatsappPhone: fromNumber,
              updatedAt: new Date(),
            })
            .where(eq(orders.id, orderRow.id));
        } catch {
          // Non-blocking update
        }
      }
    }
  }

  return NextResponse.json({ status: "EVENT_RECEIVED" });
}
