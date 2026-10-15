"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button, LinkButton } from "@/components/Button";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 199;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isLoaded, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const shipping =
    subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const canSubmit = useMemo(() => items.length > 0, [items]);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.fullName.trim().length < 2) next.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    const cleanPhone = form.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10)
      next.phone = "Enter a valid 10-digit phone number";
    if (form.address.trim().length < 5) next.address = "Enter your complete street address";
    if (form.city.trim().length < 2) next.city = "Enter your city";
    if (form.state.trim().length < 2) next.state = "Enter your state";
    const cleanPincode = form.pincode.replace(/\D/g, "");
    if (cleanPincode.length !== 6) next.pincode = "Enter a valid 6-digit postal pincode";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleProceedToUpi() {
    if (submitting) return;
    setNotice(null);
    if (!validate() || !canSubmit) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout/initiate-upi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            ...form,
            phone: form.phone.replace(/\D/g, "").slice(-10),
            pincode: form.pincode.replace(/\D/g, ""),
          },
          items,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg =
          data.error ||
          (Array.isArray(data.details)
            ? data.details.map((d: { message?: string }) => d.message).filter(Boolean).join(", ")
            : null) ||
          "Unable to initiate checkout. Please verify your details.";
        setNotice(msg);
        setSubmitting(false);
        return;
      }

      // Clear the local cart now that the payment attempt has been safely saved on server
      clearCart();

      // Navigate to the direct UPI payment and verification page
      router.push(`/order-status/${data.orderReference}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "We encountered an unexpected error initiating payment. Please try again.";
      setNotice(msg);
      setSubmitting(false);
    }
  }

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-sm text-[var(--color-charcoal)]/50">
          Loading checkout…
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-10">
        <h1 className="font-serif-display text-3xl text-[var(--color-charcoal)]">
          Your bag is empty
        </h1>
        <p className="mt-3 text-sm text-[var(--color-charcoal)]/60">
          Add pieces to your bag before checking out.
        </p>
        <div className="mt-8">
          <LinkButton href="/shop">Continue Shopping</LinkButton>
        </div>
      </main>
    );
  }

  const hasMadeToMeasureItems = items.some((item) => item.isMadeToMeasure);

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <h1 className="font-serif-display text-3xl text-[var(--color-charcoal)]">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProceedToUpi();
          }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
              Delivery Details
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-charcoal)]/80">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
              Direct UPI Payment (8555909550@ybl)
            </span>
          </div>

          <Field
            label="Full Name"
            value={form.fullName}
            error={errors.fullName}
            onChange={(v) => update("fullName", v)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Email Address"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => update("email", v)}
            />
            <Field
              label="Phone Number (10 digits)"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => update("phone", v)}
            />
          </div>
          <Field
            label="Delivery Street Address"
            value={form.address}
            error={errors.address}
            onChange={(v) => update("address", v)}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="City"
              value={form.city}
              error={errors.city}
              onChange={(v) => update("city", v)}
            />
            <Field
              label="State"
              value={form.state}
              error={errors.state}
              onChange={(v) => update("state", v)}
            />
            <Field
              label="Pincode (6 digits)"
              value={form.pincode}
              error={errors.pincode}
              onChange={(v) => update("pincode", v)}
            />
          </div>

          {notice ? (
            <div className="rounded-xs border border-[var(--color-maroon)]/30 bg-[var(--color-maroon)]/5 p-3 text-xs text-[var(--color-maroon)]">
              {notice}
            </div>
          ) : null}

          {/* Made to Measure Policy Disclosure */}
          {hasMadeToMeasureItems && (
            <div className="rounded-xs border border-amber-900/20 bg-amber-50/70 p-4 text-xs text-amber-950">
              <p className="font-semibold uppercase tracking-[0.08em] text-amber-900">
                Tailoring &amp; Custom Fit Policy:
              </p>
              <p className="mt-1 leading-relaxed text-amber-900/85">
                Your order includes bespoke made-to-measure pieces crafted to your custom proportions. Each piece is individually cut by our Pochampally artisans. Made-to-measure orders are non-refundable once production begins, except in cases of transit damage or structural defects.
              </p>
            </div>
          )}

          {/* Payment Guidance Box */}
          <div className="rounded-xs border border-[var(--color-line)] bg-[var(--color-cotton)]/40 p-5 text-xs text-[var(--color-charcoal)]">
            <p className="font-semibold uppercase tracking-[0.08em] text-[var(--color-charcoal)]">
              Direct UPI Payment Instructions
            </p>
            <ol className="mt-2.5 list-inside list-decimal space-y-1.5 leading-relaxed text-[var(--color-charcoal)]/80">
              <li>
                Clicking <strong>Proceed to UPI Payment</strong> will generate your unique order reference and lock in the dynamic total.
              </li>
              <li>
                Pay seamlessly using PhonePe, Google Pay, Paytm, or any UPI app, or scan the generated QR code on desktop.
              </li>
              <li>
                Our Pochampally studio manually compares the incoming bank credit against your order reference before confirming fulfillment.
              </li>
            </ol>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full sm:w-auto"
          >
            {submitting ? "Securing Order & Opening UPI…" : `Pay ${formatPrice(total)} via UPI →`}
          </Button>
        </form>

        <aside className="h-fit border border-[var(--color-line)] bg-white/50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Order Summary
          </p>
          <div className="mt-5 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--color-charcoal)]">
                    {item.name} &times; {item.quantity}
                  </p>
                  <p className="text-xs text-[var(--color-charcoal)]/55">
                    {item.isMadeToMeasure
                      ? "Made to Measure (Custom Fit)"
                      : item.size
                        ? `Size ${item.size}`
                        : ""}
                  </p>
                </div>
                <p className="whitespace-nowrap text-[var(--color-charcoal)]">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 border-t border-[var(--color-line)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-charcoal)]/60">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-charcoal)]/60">Shipping</span>
              <span>
                {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[var(--color-line)] pt-3 text-base font-semibold">
              <span>Payable Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--color-charcoal)]/50">
            Orders are confirmed upon atelier payment verification.{" "}
            <Link href="/cart" className="underline underline-offset-4">
              Edit bag
            </Link>
          </p>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)]/70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[var(--color-charcoal)]/25 bg-white px-3 py-3 text-sm text-[var(--color-charcoal)] outline-none focus:border-[var(--color-charcoal)]"
      />
      {error ? (
        <span className="text-[11px] text-[var(--color-maroon)]">{error}</span>
      ) : null}
    </label>
  );
}
