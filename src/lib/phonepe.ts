/**
 * PhonePe Payment Gateway V2 – OAuth2 (client_credentials) integration.
 *
 * Flow:
 *  1. POST /v1/oauth/token  → get O-Bearer access_token
 *  2. POST /checkout/v2/pay → initiate payment, get redirect URL
 *  3. User completes payment on PhonePe page
 *  4. PhonePe redirects back to our /api/checkout/verify callback
 *  5. GET  /checkout/v2/order/{merchantOrderId}/status → verify server-side
 */

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

export function isPhonePeConfigured(): boolean {
  return Boolean(
    process.env.PHONEPE_CLIENT_ID &&
      process.env.PHONEPE_CLIENT_SECRET &&
      process.env.PHONEPE_CLIENT_VERSION,
  );
}

function getBaseUrls() {
  const isProd = (process.env.PHONEPE_ENV ?? "SANDBOX") === "PRODUCTION";
  return {
    auth: isProd
      ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
    pg: isProd
      ? "https://api.phonepe.com/apis/pg"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox",
  };
}

// ---------------------------------------------------------------------------
// Token cache (in-memory, per serverless instance lifetime)
// ---------------------------------------------------------------------------

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  // Refresh if token is missing or within 60 s of expiry
  if (cachedToken && cachedToken.expiresAt - now > 60_000) {
    return cachedToken.value;
  }

  const { auth } = getBaseUrls();
  const body = new URLSearchParams({
    client_id: process.env.PHONEPE_CLIENT_ID!,
    client_version: process.env.PHONEPE_CLIENT_VERSION!,
    client_secret: process.env.PHONEPE_CLIENT_SECRET!,
    grant_type: "client_credentials",
  });

  const res = await fetch(auth, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PhonePe token request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number; // seconds
    token_type: string;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return cachedToken.value;
}

// ---------------------------------------------------------------------------
// PhonePe V2 – Pay (initiate checkout)
// ---------------------------------------------------------------------------

export interface PhonePePayV2Response {
  orderId: string;
  state: string;
  redirectUrl?: string;
  expireAt?: number;
  errorCode?: string;
  detailedErrorCode?: string;
  message?: string;
}

export async function initiatePhonePePayment({
  merchantOrderId,
  amount,
  redirectUrl,
  mobileNumber,
}: {
  merchantOrderId: string;
  amount: number; // in paisa
  redirectUrl: string;
  mobileNumber?: string;
}): Promise<PhonePePayV2Response> {
  if (!isPhonePeConfigured()) {
    throw new Error("PhonePe is not configured");
  }

  const token = await getAccessToken();
  const { pg } = getBaseUrls();

  const payload: Record<string, unknown> = {
    merchantOrderId,
    amount,
    expireAfter: 1200, // 20 minutes
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Order payment",
      merchantUrls: {
        redirectUrl,
      },
    },
  };

  if (mobileNumber) {
    payload.metaInfo = { udf1: mobileNumber };
  }

  const res = await fetch(`${pg}/checkout/v2/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as PhonePePayV2Response;

  if (!res.ok) {
    throw new Error(
      `PhonePe pay request failed (${res.status}): ${JSON.stringify(data)}`,
    );
  }

  return data;
}

// ---------------------------------------------------------------------------
// PhonePe V2 – Order Status
// ---------------------------------------------------------------------------

export interface PhonePeStatusV2Response {
  orderId: string;
  state: "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED";
  amount: number;
  expireAt?: number;
  paymentDetails?: Array<{
    transactionId: string;
    state: string;
    amount: number;
    paymentMode?: string;
    timestamp?: number;
  }>;
  errorCode?: string;
  detailedErrorCode?: string;
}

export async function verifyPhonePePayment(
  merchantOrderId: string,
): Promise<PhonePeStatusV2Response> {
  if (!isPhonePeConfigured()) {
    throw new Error("PhonePe is not configured");
  }

  const token = await getAccessToken();
  const { pg } = getBaseUrls();

  const res = await fetch(
    `${pg}/checkout/v2/order/${merchantOrderId}/status?details=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    },
  );

  const data = (await res.json()) as PhonePeStatusV2Response;

  if (!res.ok) {
    throw new Error(
      `PhonePe status check failed (${res.status}): ${JSON.stringify(data)}`,
    );
  }

  return data;
}
