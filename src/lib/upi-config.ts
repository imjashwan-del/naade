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
  let upiId = (
    process.env.NAADE_UPI_ID ||
    process.env.NEXT_PUBLIC_NAADE_UPI_ID ||
    ""
  ).trim();

  let payeeName = (
    process.env.NAADE_UPI_PAYEE_NAME ||
    process.env.NEXT_PUBLIC_NAADE_UPI_PAYEE_NAME ||
    "NAADE"
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
    // If DB is temporarily unavailable, fall back to environment variables
  }

  return {
    upiId,
    payeeName: payeeName || "NAADE",
    isConfigured: Boolean(upiId),
  };
}

/**
 * Builds a valid, standard UPI intent URI according to NPCI specifications:
 * pa: Payee VPA / UPI ID
 * pn: Payee Name
 * am: Transaction Amount in INR (formatted as 2 decimals)
 * cu: Currency (INR)
 * tn: Transaction Note
 * tr: Transaction Reference ID
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

  const searchParams = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: tn,
    tr: orderReference,
  });

  return `upi://pay?${searchParams.toString()}`;
}
