"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/format";
import { Button, LinkButton } from "@/components/Button";

type PaymentStatusData = {
  success: boolean;
  orderReference: string;
  status:
    | "PENDING_VERIFICATION"
    | "MANUALLY_VERIFIED"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELLED";
  amount: number;
  subtotal: number;
  shipping: number;
  currency: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    productId: number;
    productName: string;
    category: string;
    price: number;
    quantity: number;
    size?: string | null;
    isMadeToMeasure?: boolean;
    measurements?: Record<string, string> | null;
  }>;
  customerUpiReference: string | null;
  verifiedTransactionReference: string | null;
  verifiedAt: string | null;
  createdAt: string;
  expiresAt?: string;
  isConfigured: boolean;
  upiId: string | null;
  payeeName?: string;
  upiIntentUrl: string | null;
};

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderReference: string }>;
}) {
  const { orderReference } = use(params);

  const [data, setData] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Customer reference submission state
  const [referenceInput, setReferenceInput] = useState("");
  const [submittingRef, setSubmittingRef] = useState(false);
  const [refNotice, setRefNotice] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [hasTappedPay, setHasTappedPay] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkout/status?ref=${encodeURIComponent(orderReference)}`);
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Unable to find this order reference.");
      } else {
        setData(result);
        if (result.customerUpiReference) {
          setReferenceInput(result.customerUpiReference);
        }
      }
    } catch {
      setError("Unable to connect to NAADE. Please check your network.");
    } finally {
      setLoading(false);
    }
  }, [orderReference]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStatus();
    // Poll status gently every 15 seconds if awaiting verification
    const interval = setInterval(() => {
      loadStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadStatus]);

  async function handleCopyUpiId(upiId: string) {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // Fallback
    }
  }

  async function handleSubmitCustomerReference(e: React.FormEvent) {
    e.preventDefault();
    if (!referenceInput.trim()) return;
    setSubmittingRef(true);
    setRefNotice(null);

    try {
      const res = await fetch("/api/checkout/submit-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderReference,
          customerUpiReference: referenceInput.trim(),
        }),
      });
      const resData = await res.json();
      if (!res.ok) {
        setRefNotice(resData.error || "Unable to save reference.");
      } else {
        setRefNotice("Reference submitted. Our team will verify this with the receiving bank statement before confirming your order.");
        await loadStatus();
      }
    } catch {
      setRefNotice("Network error. Please try again.");
    } finally {
      setSubmittingRef(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-sm text-[var(--color-charcoal)]/50">
          Loading order status…
        </p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-10">
        <h1 className="font-serif-display text-2xl text-[var(--color-charcoal)]">
          Order Not Found
        </h1>
        <p className="mt-3 text-sm text-[var(--color-charcoal)]/60">
          {error || "We could not find an order matching this reference."}
        </p>
        <div className="mt-8">
          <LinkButton href="/shop">Continue Shopping</LinkButton>
        </div>
      </main>
    );
  }

  const isPending = data.status === "PENDING_VERIFICATION";
  const isVerified = data.status === "MANUALLY_VERIFIED";
  const isRejected = data.status === "REJECTED";
  const isExpired = data.status === "EXPIRED" || data.status === "CANCELLED";

  // QR Code URL (using reliable standard QR image API based on the exact UPI intent)
  const qrCodeUrl = data.upiIntentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.upiIntentUrl)}&size=220x220&margin=8`
    : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="text-center">
        <p className="ikat-diamonds justify-center text-[var(--color-maroon)]">
          <span />
          <span />
          <span />
        </p>
        <h1 className="mt-4 font-serif-display text-3xl text-[var(--color-charcoal)] sm:text-4xl">
          {isVerified
            ? "Order Confirmed"
            : isRejected
              ? "Payment Verification Needed"
              : isExpired
                ? "Payment Attempt Expired"
                : "Complete Your UPI Payment"}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-charcoal)]/70">
          {isVerified
            ? "Payment verified. Your NAADE order is confirmed."
            : isRejected
              ? "We could not verify your payment yet. Please check your transaction history before trying again."
              : isExpired
                ? "This payment attempt has expired. Please initiate a new order."
                : hasTappedPay
                  ? "Your payment is awaiting verification. Your order will be confirmed once payment is verified."
                  : "Complete your UPI payment to place your order."}
        </p>
      </div>

      {/* Status Banner */}
      <div className="mt-8">
        {isPending && (
          <div className="border border-amber-900/20 bg-amber-50/70 p-5 text-amber-900 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                Status: Awaiting Manual Verification
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
              {hasTappedPay
                ? "Your payment is awaiting verification. Your order will be confirmed once payment is verified in our receiving bank account."
                : "Transfer the exact amount below using your UPI app. Our atelier manually inspects and verifies the bank statement before confirming your garment production."}
            </p>
          </div>
        )}

        {isVerified && (
          <div className="border border-emerald-900/20 bg-emerald-50/80 p-5 text-emerald-900 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                Status: Payment Verified &amp; Confirmed (PAID)
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-emerald-900/90">
              Payment verified. Your NAADE order is confirmed. Our Pochampally artisans have received your order details for tailoring and dispatch.
            </p>
            {data.verifiedTransactionReference && (
              <p className="mt-1 text-[11px] text-emerald-800/80 font-mono">
                Verified Bank Ref: {data.verifiedTransactionReference}
              </p>
            )}
          </div>
        )}

        {isRejected && (
          <div className="border border-[var(--color-maroon)]/30 bg-[var(--color-maroon)]/5 p-5 text-[var(--color-maroon)] rounded-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Status: Payment Could Not Be Verified
            </p>
            <p className="mt-2 text-xs leading-relaxed">
              We could not verify your payment yet. Please check your transaction history before trying again. If you believe this is an error, please reach out to us directly with your order reference.
            </p>
            <div className="mt-3 flex gap-4 text-xs font-semibold">
              <a
                href="https://wa.me/918555909550"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Chat on WhatsApp →
              </a>
              <a href="mailto:hello@naade.in" className="underline underline-offset-4">
                Email hello@naade.in →
              </a>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="border border-black/15 bg-black/5 p-5 text-[var(--color-charcoal)] rounded-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Status: Payment Window Expired
            </p>
            <p className="mt-1 text-xs text-[var(--color-charcoal)]/70">
              This payment attempt was not verified within the active window. Return to the shop to place a new order.
            </p>
          </div>
        )}
      </div>

      {/* Order Meta Bar */}
      <div className="mt-8 grid gap-4 border-y border-[var(--color-line)] py-6 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)]/50">
            Order Reference
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-[var(--color-charcoal)]">
            {data.orderReference}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)]/50">
            Amount Due
          </p>
          <p className="mt-1 text-base font-bold text-[var(--color-charcoal)]">
            {formatPrice(data.amount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)]/50">
            Initiated At
          </p>
          <p className="mt-1 text-xs text-[var(--color-charcoal)]">
            {formatDate(data.createdAt)}
          </p>
        </div>
      </div>

      {/* Direct UPI Payment Section (Only active when pending) */}
      {isPending && (
        <section className="mt-8 rounded-sm border border-[var(--color-line)] bg-white p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-maroon)]">
            Direct UPI Payment
          </p>
          <h2 className="mt-1 font-serif-display text-xl text-[var(--color-charcoal)]">
            Pay ₹{data.amount.toLocaleString("en-IN")} via PhonePe or Any UPI App
          </h2>

          {!data.isConfigured ? (
            <div className="mt-4 border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800">
              <p className="font-semibold">UPI Configuration Required:</p>
              <p className="mt-1">
                The receiving UPI ID is currently not configured on this store. Please set <code>NAADE_UPI_ID</code> in environment variables or configure Receiving UPI ID in the NAADE Admin Panel (Content → Header &amp; Footer).
              </p>
            </div>
          ) : (
            <>
              {/* Primary Mobile Payment Intent Button */}
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={data.upiIntentUrl || "#"}
                  onClick={() => setHasTappedPay(true)}
                  className="inline-flex items-center justify-center rounded-sm bg-[var(--color-charcoal)] px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] transition-colors hover:bg-black"
                >
                  Pay with UPI (PhonePe / GPay / Any UPI App) →
                </a>
                <p className="text-center text-[11px] text-[var(--color-charcoal)]/60">
                  Compatible with PhonePe, Google Pay, Paytm, BHIM, and other UPI apps installed on your device.
                </p>
              </div>

              {/* UPI Details Card & QR Code */}
              <div className="mt-8 grid items-center gap-6 border-t border-[var(--color-line)] pt-6 sm:grid-cols-[1fr_200px]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]/70">
                    Or Pay Manually via VPA / UPI ID:
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-[var(--color-charcoal)] bg-[var(--color-offwhite)] px-3 py-2 border border-[var(--color-line)]">
                      {data.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyUpiId(data.upiId!)}
                      className="border border-[var(--color-charcoal)]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[var(--color-charcoal)] hover:text-white transition-colors"
                    >
                      {copiedUpi ? "✓ Copied!" : "Copy UPI ID"}
                    </button>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--color-charcoal)]/70">
                    <div>
                      <dt className="font-medium text-[var(--color-charcoal)]">Payee:</dt>
                      <dd>{data.payeeName || "NAADE"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-[var(--color-charcoal)]">Reference / Note:</dt>
                      <dd className="font-mono">{data.orderReference}</dd>
                    </div>
                  </dl>
                </div>

                {qrCodeUrl && (
                  <div className="flex flex-col items-center justify-center rounded border border-[var(--color-line)] bg-white p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCodeUrl}
                      alt="NAADE UPI Payment QR Code"
                      width={180}
                      height={180}
                      className="aspect-square"
                    />
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-charcoal)]/60">
                      Scan to Pay via PhonePe / UPI
                    </p>
                  </div>
                )}
              </div>

              {/* Customer-Submitted Reference Box */}
              <div className="mt-8 border-t border-[var(--color-line)] pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]">
                  Completed Payment? Share Your Reference (Optional)
                </p>
                <p className="mt-1 text-xs text-[var(--color-charcoal)]/60">
                  If you have already paid in your UPI app, you may enter the 12-digit UTR / Transaction ID below.
                </p>

                <form onSubmit={handleSubmitCustomerReference} className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value)}
                    placeholder="Enter UPI UTR / Transaction ID (e.g. 4289...)"
                    className="flex-1 border border-[var(--color-charcoal)]/25 px-3 py-2 text-sm font-mono outline-none focus:border-[var(--color-charcoal)]"
                  />
                  <button
                    type="submit"
                    disabled={submittingRef || !referenceInput.trim()}
                    className="border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-ivory)] hover:bg-black disabled:opacity-50"
                  >
                    {submittingRef ? "Saving…" : "Save Reference"}
                  </button>
                </form>

                {data.customerUpiReference && (
                  <p className="mt-2 text-[11px] text-[var(--color-charcoal)]/70">
                    <span className="font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mr-1.5 border border-amber-200">
                      Customer-submitted reference — unverified
                    </span>
                    <span className="font-mono">{data.customerUpiReference}</span>
                  </p>
                )}

                {refNotice && (
                  <p className="mt-2 text-xs text-[var(--color-maroon)]">{refNotice}</p>
                )}

                <p className="mt-2 text-[10px] italic text-[var(--color-charcoal)]/50">
                  Note: Submitting this reference notifies our team to match your transaction against the receiving bank account, but does not automatically mark your order as confirmed.
                </p>
              </div>
            </>
          )}

          {/* Refresh status */}
          <div className="mt-6 flex justify-between items-center border-t border-[var(--color-line)] pt-4 text-xs text-[var(--color-charcoal)]/60">
            <span>Auto-checking verification every 15 seconds…</span>
            <button
              type="button"
              onClick={loadStatus}
              className="font-semibold uppercase tracking-[0.08em] underline hover:text-[var(--color-charcoal)]"
            >
              Refresh Status ↻
            </button>
          </div>
        </section>
      )}

      {/* Products & Delivery Details */}
      <div className="mt-8 border-t border-[var(--color-line)] pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
          Items in this order
        </p>
        <div className="mt-4 flex flex-col divide-y divide-[var(--color-line)]">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--color-charcoal)]">
                  {item.productName} &times; {item.quantity}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-charcoal)]/60">
                  {item.isMadeToMeasure
                    ? "Made to Measure (Personal Fit)"
                    : item.size
                      ? `Size ${item.size}`
                      : "Standard"}
                </p>
              </div>
              <p className="whitespace-nowrap text-[var(--color-charcoal)]">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-[var(--color-line)] pt-4 text-sm">
          <div className="flex justify-between text-xs text-[var(--color-charcoal)]/70">
            <span>Subtotal</span>
            <span>{formatPrice(data.subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--color-charcoal)]/70">
            <span>Shipping</span>
            <span>{data.shipping === 0 ? "Complimentary" : formatPrice(data.shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base text-[var(--color-charcoal)] pt-2 border-t border-[var(--color-line)]">
            <span>Total Payable</span>
            <span>{formatPrice(data.amount)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--color-line)] pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50">
          Delivery Address
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]">
          {data.customerName}
          <br />
          {data.address}, {data.city}, {data.state} {data.pincode}
          <br />
          {data.phone}
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-line)] pt-6">
        <p className="text-xs text-[var(--color-charcoal)]/60">
          Bookmark or save this URL to revisit your order reference at any time.
        </p>
        <LinkButton href="/shop" variant="outline">
          Continue Shopping
        </LinkButton>
      </div>
    </main>
  );
}
