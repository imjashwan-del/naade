import { getSiteContent } from "@/lib/site-content-db";

export type UpiConfig = {
  upiId: string;
  payeeName: string;
  isConfigured: boolean;
};

/**
 * Retrieves the configured UPI details.
 * Checks the database site_content first (allowing zero-deploy admin edits),
 * falling back to NAADE_UPI_ID or NEXT_PUBLIC_NAADE_UPI_ID in environment variables.
 */
export async function getUpiConfig(): Promise<UpiConfig> {
  const DEFAULT_UPI_ID = "8555909550@ybl";
  const DEFAULT_PAYEE_NAME = "NAADE";

  let upiId = (
    process.env.NAADE_UPI_ID ||
    process.env.NEXT_PUBLIC_NAADE_UPI_ID ||
    DEFAULT_UPI_ID
  ).trim();

  let payeeName = (
    process.env.NAADE_UPI_PAYEE_NAME ||
    process.env.NEXT_PUBLIC_NAADE_UPI_PAYEE_NAME ||
    DEFAULT_PAYEE_NAME
  ).trim();

  try {
    const globalContent = await getSiteContent("global");
    if (globalContent.receivingUpiId?.trim()) {
      upiId = globalContent.receivingUpiId.trim();
    }
    if (globalContent.upiPayeeName?.trim()) {
      payeeName = globalContent.upiPayeeName.trim();
    }
  } catch {
    // If DB is temporarily unavailable, fall back to environment variables / defaults
  }

  return {
    upiId: upiId || DEFAULT_UPI_ID,
    payeeName: payeeName || DEFAULT_PAYEE_NAME,
    isConfigured: true,
  };
}

/**
 * Builds a valid, standard UPI intent URI according to NPCI specifications:
 * pa: Payee VPA / UPI ID
 * pn: Payee Name
 * am: Transaction Amount in INR (formatted as 2 decimals, e.g. 1499.00)
 * cu: Currency (INR)
 * tn: Transaction Note (with %20 for spaces per NPCI spec)
 * tr: Transaction Reference ID
 *
 * Expected format:
 * upi://pay?pa=8555909550%40ybl&pn=NAADE&am=1499.00&cu=INR&tn=Order%20NAADE-ORDERREF
 */
export function buildUpiPaymentUri(params: {
  upiId: string;
  payeeName: string;
  amount: number;
  orderReference: string;
  note?: string;
}): string {
  const { upiId, payeeName, amount, orderReference, note } = params;
  const tn = note || `Order ${orderReference}`;
  const am = amount.toFixed(2);

  // URLSearchParams uses "+" for spaces in query params, but NPCI UPI intents
  // on mobile operating systems require percent-encoding (%20) for spaces.
  const searchParams = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: am,
    cu: "INR",
    tn: tn,
    tr: orderReference,
  });

  const queryString = searchParams.toString().replace(/\+/g, "%20");
  return `upi://pay?${queryString}`;
}

/**
 * Helper to build app-specific UPI intents for seamless mobile app opening
 */
export function buildAppSpecificUpiUris(params: {
  upiId: string;
  payeeName: string;
  amount: number;
  orderReference: string;
  note?: string;
}) {
  const genericUri = buildUpiPaymentUri(params);
  const queryPart = genericUri.replace(/^upi:\/\/pay\?/, "");

  return {
    generic: genericUri,
    phonePe: `phonepe://pay?${queryPart}`,
    googlePay: `tez://upi/pay?${queryPart}`,
    paytm: `paytmmp://pay?${queryPart}`,
  };
}
