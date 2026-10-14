"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import type { PaymentAttempt } from "@/db/schema";

type Counts = {
  pending: number;
  verified: number;
  cancelledExpired: number;
  total: number;
};

export default function AdminPendingPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "cancelled_expired">("pending");
  const [attempts, setAttempts] = useState<PaymentAttempt[]>([]);
  const [counts, setCounts] = useState<Counts>({ pending: 0, verified: 0, cancelledExpired: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  // Verification modal state
  const [selectedAttempt, setSelectedAttempt] = useState<PaymentAttempt | null>(null);
  const [verifiedUtr, setVerifiedUtr] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Reject modal state
  const [rejectingAttempt, setRejectingAttempt] = useState<PaymentAttempt | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pending-payments?status=${activeTab}`);
      const data = await res.json();
      if (res.ok) {
        setAttempts(data.attempts ?? []);
        if (data.counts) setCounts(data.counts);
      }
    } catch {
      setNotice("Failed to load payment attempts.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  function openVerifyModal(attempt: PaymentAttempt) {
    setSelectedAttempt(attempt);
    setVerifiedUtr(attempt.customerUpiReference || "");
    setAdminNotes("");
    setNotice(null);
  }

  async function handleConfirmVerification(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAttempt) return;
    if (!verifiedUtr.trim()) {
      alert("Please enter the verified bank / PhonePe UTR transaction reference.");
      return;
    }

    setVerifying(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/pending-payments/${selectedAttempt.orderReference}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifiedTransactionReference: verifiedUtr.trim(),
          notes: adminNotes.trim() || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setNotice(result.error || "Verification failed.");
      } else {
        setNotice(`Order ${selectedAttempt.orderReference} confirmed successfully! It has been moved to Confirmed Orders.`);
        setSelectedAttempt(null);
        await loadData();
      }
    } catch {
      setNotice("Network error while verifying payment.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleConfirmReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectingAttempt) return;
    if (!rejectReason.trim()) {
      alert("Please enter a reason for cancellation / rejection.");
      return;
    }

    setRejecting(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/pending-payments/${rejectingAttempt.orderReference}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      const result = await res.json();
      if (!res.ok) {
        setNotice(result.error || "Rejection failed.");
      } else {
        setNotice(`Payment attempt ${rejectingAttempt.orderReference} rejected.`);
        setRejectingAttempt(null);
        await loadData();
      }
    } catch {
      setNotice("Network error while rejecting payment.");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-maroon)]">
            Payment Management
          </p>
          <h1 className="font-serif-display text-2xl text-[var(--color-charcoal)]">
            Direct UPI — Pending Payments
          </h1>
        </div>
        <Link
          href="/admin/orders"
          className="w-fit border border-[var(--color-charcoal)]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[var(--color-charcoal)] hover:text-white transition-colors"
        >
          View Confirmed Orders →
        </Link>
      </div>

      {/* Manual Verification Workflow Banner */}
      <div className="rounded-sm border border-[var(--color-line)] bg-amber-50/60 p-5 text-xs text-amber-950">
        <p className="font-semibold uppercase tracking-[0.1em] text-amber-900">
          Manual Payment Verification Workflow:
        </p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-amber-900/85">
          <li>Open your PhonePe or Bank Business app and inspect your transaction history.</li>
          <li>Match the incoming credit with the customer name, exact amount, and timestamp below.</li>
          <li>Click <strong>Verify Payment &amp; Confirm Order</strong> to input the verified UTR reference.</li>
          <li>On confirmation, the order is atomically created in the confirmed Orders section with status <strong>PAID</strong>.</li>
        </ol>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-[var(--color-line)] pb-3 text-xs font-semibold uppercase tracking-[0.1em]">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 transition-colors ${
            activeTab === "pending"
              ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
              : "text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
          }`}
        >
          Awaiting Verification ({counts.pending})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("verified")}
          className={`px-3 py-1.5 transition-colors ${
            activeTab === "verified"
              ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
              : "text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
          }`}
        >
          Verified Attempts ({counts.verified})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cancelled_expired")}
          className={`px-3 py-1.5 transition-colors ${
            activeTab === "cancelled_expired"
              ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
              : "text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
          }`}
        >
          Cancelled / Expired ({counts.cancelledExpired})
        </button>
      </div>

      {notice && (
        <div className="rounded bg-black/90 p-4 text-xs text-white">
          {notice}
        </div>
      )}

      {/* Attempts Table */}
      {loading ? (
        <p className="py-8 text-sm text-[var(--color-charcoal)]/50">Loading payment attempts…</p>
      ) : attempts.length === 0 ? (
        <div className="border border-dashed border-[var(--color-line)] py-12 text-center text-sm text-[var(--color-charcoal)]/60">
          No payment attempts found in this tab.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-[var(--color-line)] bg-white">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] bg-[var(--color-offwhite)]/50 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]/60">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items &amp; Measurements</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Customer-Submitted Ref</th>
                <th className="py-3.5 px-4">Status / Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="border-b border-[var(--color-line)] align-top hover:bg-black/[0.01]">
                  {/* Order Ref */}
                  <td className="py-4 px-4 font-mono font-medium text-xs text-[var(--color-charcoal)]">
                    {attempt.orderReference}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4 text-xs text-[var(--color-charcoal)]">
                    <p className="font-semibold text-sm">{attempt.customerName}</p>
                    <p className="text-[var(--color-charcoal)]/75 mt-0.5">{attempt.phone}</p>
                    <p className="text-[var(--color-charcoal)]/60">{attempt.email}</p>
                    <p className="mt-1 text-[11px] text-[var(--color-charcoal)]/65 leading-tight">
                      {attempt.address}, {attempt.city}, {attempt.state} - {attempt.pincode}
                    </p>
                  </td>

                  {/* Items */}
                  <td className="py-4 px-4 text-xs text-[var(--color-charcoal)]/80">
                    <div className="space-y-1.5 max-w-[240px]">
                      {attempt.items.map((item, idx) => (
                        <div key={idx} className="border-b border-black/5 pb-1 last:border-0">
                          <p className="font-medium text-[var(--color-charcoal)]">
                            {item.productName} &times; {item.quantity}
                          </p>
                          <p className="text-[11px] text-[var(--color-charcoal)]/60">
                            {item.isMadeToMeasure
                              ? "Made to Measure (MTM)"
                              : item.size
                                ? `Size: ${item.size}`
                                : "Standard"}
                          </p>
                          {item.isMadeToMeasure && item.measurements && (
                            <div className="text-[10px] text-[var(--color-charcoal)]/60">
                              {Object.entries(item.measurements)
                                .map(([k, v]) => `${k}: ${v}"`)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 whitespace-nowrap font-semibold text-sm text-[var(--color-charcoal)]">
                    {formatPrice(attempt.total)}
                  </td>

                  {/* Customer-Submitted Ref */}
                  <td className="py-4 px-4 text-xs">
                    {attempt.customerUpiReference ? (
                      <div>
                        <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900 border border-amber-300">
                          Customer-submitted reference — unverified
                        </span>
                        <p className="mt-1 font-mono font-medium text-[var(--color-charcoal)]">
                          {attempt.customerUpiReference}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[var(--color-charcoal)]/40 italic">None provided</span>
                    )}
                  </td>

                  {/* Status / Date */}
                  <td className="py-4 px-4 text-xs text-[var(--color-charcoal)]/70 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${
                        attempt.status === "PENDING_VERIFICATION"
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : attempt.status === "MANUALLY_VERIFIED"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            : "bg-black/10 text-black/70"
                      }`}
                    >
                      {attempt.status}
                    </span>
                    <p className="mt-1.5 text-[11px] text-[var(--color-charcoal)]/50">
                      {formatDate(attempt.createdAt)}
                    </p>
                    {attempt.verifiedTransactionReference && (
                      <p className="mt-1 font-mono text-[10px] text-emerald-800">
                        Verified Ref: {attempt.verifiedTransactionReference}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    {attempt.status === "PENDING_VERIFICATION" ? (
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => openVerifyModal(attempt)}
                          className="bg-emerald-800 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] hover:bg-emerald-900 rounded-sm transition-colors"
                        >
                          Verify &amp; Confirm Order
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingAttempt(attempt);
                            setRejectReason("");
                          }}
                          className="text-[11px] text-[var(--color-maroon)] underline hover:text-black"
                        >
                          Reject / Cancel
                        </button>
                      </div>
                    ) : attempt.status === "MANUALLY_VERIFIED" && attempt.orderId ? (
                      <Link
                        href={`/admin/orders/${attempt.orderId}`}
                        className="text-xs font-semibold text-[var(--color-charcoal)] underline uppercase"
                      >
                        Manage Confirmed Order →
                      </Link>
                    ) : (
                      <span className="text-xs text-[var(--color-charcoal)]/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Verification Modal Dialog */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-sm bg-white p-6 shadow-2xl sm:p-8">
            <h2 className="font-serif-display text-xl text-[var(--color-charcoal)]">
              Verify Payment &amp; Confirm Order
            </h2>
            <p className="mt-1 text-xs text-[var(--color-charcoal)]/60">
              Confirm that you have inspected your PhonePe / bank transaction history and verified receipt of funds.
            </p>

            <div className="mt-5 rounded border border-[var(--color-line)] bg-[var(--color-offwhite)] p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--color-charcoal)]/60">Order Reference:</span>
                <span className="font-mono font-bold text-[var(--color-charcoal)]">{selectedAttempt.orderReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-charcoal)]/60">Amount to Verify:</span>
                <span className="font-bold text-sm text-[var(--color-charcoal)]">{formatPrice(selectedAttempt.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-charcoal)]/60">Customer:</span>
                <span className="font-medium">{selectedAttempt.customerName} ({selectedAttempt.phone})</span>
              </div>
            </div>

            <form onSubmit={handleConfirmVerification} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]/80">
                  Verified Bank / PhonePe UTR Reference *
                </label>
                <input
                  type="text"
                  required
                  value={verifiedUtr}
                  onChange={(e) => setVerifiedUtr(e.target.value)}
                  placeholder="e.g. 428901928374 or PhonePe Ref ID"
                  className="mt-1.5 w-full border border-[var(--color-charcoal)]/30 px-3 py-2 text-sm font-mono outline-none focus:border-[var(--color-charcoal)]"
                />
                <p className="mt-1 text-[10px] text-[var(--color-charcoal)]/50">
                  Record the official bank transaction ID or UTR number from your statement for the audit log.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]/80">
                  Verification Notes (Optional)
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified on HDFC Statement / PhonePe Business"
                  className="mt-1.5 w-full border border-[var(--color-charcoal)]/30 px-3 py-2 text-sm outline-none focus:border-[var(--color-charcoal)]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[var(--color-line)]">
                <button
                  type="button"
                  disabled={verifying}
                  onClick={() => setSelectedAttempt(null)}
                  className="border border-[var(--color-charcoal)]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className="bg-emerald-800 text-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-emerald-900 disabled:opacity-50"
                >
                  {verifying ? "Confirming Order…" : "Confirm Order & Mark PAID"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal Dialog */}
      {rejectingAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-2xl">
            <h2 className="font-serif-display text-lg text-[var(--color-charcoal)]">
              Reject Payment Attempt
            </h2>
            <p className="mt-1 text-xs text-[var(--color-charcoal)]/60">
              Payment attempt {rejectingAttempt.orderReference} will be marked as REJECTED.
            </p>

            <form onSubmit={handleConfirmReject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]/80">
                  Reason for rejection *
                </label>
                <input
                  type="text"
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Credit not found in bank account / Customer cancelled"
                  className="mt-1.5 w-full border border-[var(--color-charcoal)]/30 px-3 py-2 text-sm outline-none focus:border-[var(--color-charcoal)]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[var(--color-line)]">
                <button
                  type="button"
                  disabled={rejecting}
                  onClick={() => setRejectingAttempt(null)}
                  className="border border-[var(--color-charcoal)]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejecting}
                  className="bg-[var(--color-maroon)] text-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] hover:opacity-90 disabled:opacity-50"
                >
                  {rejecting ? "Rejecting…" : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
