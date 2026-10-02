"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button, LinkButton } from "@/components/Button";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/load-razorpay";

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
  const { items, subtotal, isLoaded, clearCart } = useCart();
  const router = useRouter();
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
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.phone.trim().length < 10)
      next.phone = "Enter a valid phone number";
    if (form.address.trim().length < 5) next.address = "Enter your address";
    if (form.city.trim().length < 2) next.city = "Enter your city";
    if (form.state.trim().length < 2) next.state = "Enter your state";
    if (form.pincode.trim().length < 4) next.pincode = "Enter a valid pincode";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePayNow() {
    setNotice(null);
    if (!validate() || !canSubmit) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNotice(data.error || "Something went wrong creating your order.");
        setSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setNotice("Unable to load the payment gateway. Please try again.");
        setSubmitting(false);
        return;
      }

      openRazorpayCheckout({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "NAADE",
        description: "Order payment",
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#201d1a" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber: data.orderNumber,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.push(`/order-confirmation/${data.orderNumber}`);
          } else {
            setNotice("Payment verification failed. Please contact support.");
          }
          setSubmitting(false);
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
    } catch {
      setNotice("Something went wrong. Please try again.");
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
          Add something to your bag before checking out.
        </p>
        <div className="mt-8">
          <LinkButton href="/shop">Continue Shopping</LinkButton>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <h1 className="font-serif-display text-3xl text-[var(--color-charcoal)]">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePayNow();
          }}
          className="flex flex-col gap-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Customer Information
          </p>
          <Field
            label="Full Name"
            value={form.fullName}
            error={errors.fullName}
            onChange={(v) => update("fullName", v)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => update("email", v)}
            />
            <Field
              label="Phone"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => update("phone", v)}
            />
          </div>
          <Field
            label="Address"
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
              label="Pincode"
              value={form.pincode}
              error={errors.pincode}
              onChange={(v) => update("pincode", v)}
            />
          </div>

          {notice ? (
            <p className="text-sm text-[var(--color-maroon)]">{notice}</p>
          ) : null}

          <Button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full sm:w-auto"
          >
            {submitting ? "Processing…" : "Pay Now"}
          </Button>
        </form>

        <aside className="h-fit border border-[var(--color-line)] p-6">
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
                      ? "Made to Measure"
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
            <div className="mt-2 flex justify-between border-t border-[var(--color-line)] pt-3 text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--color-charcoal)]/50">
            Prepaid only. Payments are processed securely via Razorpay. Orders
            are confirmed after payment.{" "}
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
