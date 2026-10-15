"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

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
        <p className="font-serif text-sm text-[var(--color-charcoal)]/50">
          Preparing secure checkout…
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-10">
        <h1 className="font-serif-display text-3xl uppercase tracking-[0.1em] text-[var(--color-charcoal)]">
          Your Bag is Empty
        </h1>
        <p className="mt-3 font-serif text-sm text-[var(--color-charcoal)]/70">
          Select pieces to add to your bag before checking out.
        </p>
        <div className="mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 py-3.5 font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ivory)] hover:bg-[var(--color-oxblood)]"
          >
            Explore Collection &rarr;
          </Link>
        </div>
      </main>
    );
  }

  const hasMadeToMeasureItems = items.some((item) => item.isMadeToMeasure);

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
        <h1 className="font-serif-display text-2xl uppercase tracking-[0.14em] text-[var(--color-charcoal)] sm:text-3xl">
          Checkout &bull; Direct Atelier Order
        </h1>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProceedToUpi();
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-oxblood)]">
              1. SHIPPING DESTINATION
            </p>
            <span className="inline-flex items-center gap-1.5 font-serif text-xs text-[var(--color-charcoal)]/80">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-700" />
              Direct UPI Verification (8555909550@ybl)
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
              label="Email Address (for order tracking)"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => update("email", v)}
            />
            <Field
              label="Phone Number (10 digits for delivery)"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => update("phone", v)}
            />
          </div>
          <Field
            label="Complete Delivery Street Address"
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
            <div className="border border-[var(--color-oxblood)]/40 bg-[var(--color-oxblood)]/5 p-3.5 font-serif text-xs text-[var(--color-oxblood)]">
              {notice}
            </div>
          ) : null}

          {/* Made to Measure Policy Disclosure */}
          {hasMadeToMeasureItems && (
            <div className="border border-[var(--color-turmeric)]/40 bg-[var(--color-parchment)] p-4 font-serif text-xs text-[var(--color-charcoal)]">
              <p className="font-semibold uppercase tracking-[0.1em] text-[var(--color-oxblood)]">
                Bespoke Tailoring &amp; Custom Fit Guarantee:
              </p>
              <p className="mt-1 leading-relaxed text-[var(--color-charcoal)]/85">
                Your order includes bespoke made-to-measure pieces crafted to your custom proportions. Each piece is individually cut by our Pochampally master weavers. Made-to-measure orders are non-refundable once cutting begins, except in cases of transit damage or structural defects.
              </p>
            </div>
          )}

          {/* Payment Guidance Box */}
          <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-5 font-serif text-xs text-[var(--color-charcoal)] shadow-2xs">
            <p className="font-semibold uppercase tracking-[0.14em] text-[var(--color-oxblood)]">
              Direct UPI Safeguarded Payment
            </p>
            <ol className="mt-3 list-inside list-decimal space-y-2 leading-relaxed text-[var(--color-charcoal)]/85">
              <li>
                Clicking <strong>Proceed to UPI Payment</strong> generates your unique order reference and registers the order.
              </li>
              <li>
                You can pay using PhonePe, Google Pay, Paytm, or scan the official NAADE atelier QR code directly.
              </li>
              <li>
                Our studio compares the incoming bank reference with your order before dispatching your handloom pieces.
              </li>
            </ol>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 py-4 font-serif text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "SECURING ORDER & OPENING UPI…" : `PAY ${formatPrice(total)} VIA UPI &rarr;`}
          </button>
        </form>

        <aside className="h-fit border border-[var(--color-line)] bg-[var(--color-parchment)] p-6 shadow-2xs">
          <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-oxblood)]">
            ORDER SUMMARY
          </p>
          <div className="mt-5 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex justify-between gap-3 font-serif text-sm border-b border-[var(--color-line)] pb-3"
              >
                <div>
                  <p className="font-medium text-[var(--color-charcoal)]">
                    {item.name} &times; {item.quantity}
                  </p>
                  <p className="text-xs text-[var(--color-charcoal)]/60">
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

          <div className="mt-5 flex flex-col gap-2 font-serif text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-charcoal)]/70">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-charcoal)]/70">Shipping</span>
              <span>
                {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[var(--color-line)] pt-3 text-base font-semibold text-[var(--color-charcoal)]">
              <span>Payable Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-4 border-t border-[var(--color-line)] pt-3 font-serif text-xs text-[var(--color-charcoal)]/60">
            Orders are confirmed upon studio payment verification.{" "}
            <Link href="/cart" className="underline underline-offset-4 hover:text-[var(--color-oxblood)]">
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
    <label className="flex flex-col gap-1.5 font-serif">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/80">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[var(--color-line)] bg-white px-3.5 py-3 font-sans text-sm text-[var(--color-charcoal)] outline-none transition-colors focus:border-[var(--color-oxblood)]"
      />
      {error ? (
        <span className="text-[11px] text-[var(--color-oxblood)]">{error}</span>
      ) : null}
    </label>
  );
}
