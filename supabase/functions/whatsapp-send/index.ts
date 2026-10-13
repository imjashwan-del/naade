import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  sendWhatsAppTextMessage,
  sendWhatsAppImageMessage,
  type WhatsAppConfig,
} from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Verify internal service role / admin key authorization
  const authHeader = req.headers.get("authorization") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceKey || !authHeader.includes(serviceKey)) {
    console.warn("[whatsapp-send] Unauthorized attempt to access internal send function");
    return json({ error: "Unauthorized: Service key required" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const to = String(body.to || "").replace(/\D/g, "");
  const type = String(body.type || "text");

  if (!to || to.length < 10) {
    return json({ error: "Invalid recipient phone number" }, 400);
  }

  const config: WhatsAppConfig = {
    accessToken: Deno.env.get("WHATSAPP_ACCESS_TOKEN") || "",
    phoneNumberId: Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") || "",
    apiVersion: Deno.env.get("WHATSAPP_API_VERSION") || "v21.0",
  };

  if (!config.accessToken || !config.phoneNumberId) {
    return json(
      { error: "WhatsApp Cloud API credentials not configured on server" },
      500
    );
  }

  try {
    let result;
    if (type === "image") {
      const imageUrl = String(body.imageUrl || "");
      const caption = body.caption ? String(body.caption) : undefined;
      if (!imageUrl.startsWith("http")) {
        return json({ error: "Valid imageUrl is required for type=image" }, 400);
      }
      result = await sendWhatsAppImageMessage(config, {
        to,
        imageUrl,
        caption,
      });
    } else {
      const messageBody = String(body.body || "");
      if (!messageBody.trim()) {
        return json({ error: "Message body is required for type=text" }, 400);
      }
      result = await sendWhatsAppTextMessage(config, {
        to,
        body: messageBody,
        previewUrl: Boolean(body.previewUrl),
      });
    }

    return json({ success: true, result });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to send message";
    return json({ error: errorMsg }, 502);
  }
});
