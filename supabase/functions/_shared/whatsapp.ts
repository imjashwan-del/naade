/**
 * Reusable WhatsApp Cloud API client module for sending messages.
 * Compatible with Supabase Edge Functions (Deno) and server runtimes.
 */

export interface WhatsAppSendTextOptions {
  to: string;
  body: string;
  previewUrl?: boolean;
}

export interface WhatsAppSendImageOptions {
  to: string;
  imageUrl: string;
  caption?: string;
}

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion?: string;
}

/**
 * Sends a plain text message via WhatsApp Cloud API.
 */
export async function sendWhatsAppTextMessage(
  config: WhatsAppConfig,
  options: WhatsAppSendTextOptions
) {
  const version = config.apiVersion || "v21.0";
  const url = `https://graph.facebook.com/${version}/${config.phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: options.to,
    type: "text",
    text: {
      preview_url: options.previewUrl ?? false,
      body: options.body,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || "WhatsApp API request failed";
    const errorCode = data?.error?.code || response.status;
    console.error(`[whatsapp-send] Error sending text to ${options.to}:`, {
      code: errorCode,
      message: errorMsg,
      type: data?.error?.type,
    });
    throw new Error(`WhatsApp API Error (${errorCode}): ${errorMsg}`);
  }

  return data;
}

/**
 * Sends an image message with caption via WhatsApp Cloud API.
 */
export async function sendWhatsAppImageMessage(
  config: WhatsAppConfig,
  options: WhatsAppSendImageOptions
) {
  const version = config.apiVersion || "v21.0";
  const url = `https://graph.facebook.com/${version}/${config.phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: options.to,
    type: "image",
    image: {
      link: options.imageUrl,
      ...(options.caption ? { caption: options.caption } : {}),
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || "WhatsApp Image API request failed";
    const errorCode = data?.error?.code || response.status;
    console.error(`[whatsapp-send] Error sending image to ${options.to}:`, {
      code: errorCode,
      message: errorMsg,
      type: data?.error?.type,
    });
    throw new Error(`WhatsApp API Error (${errorCode}): ${errorMsg}`);
  }

  return data;
}
