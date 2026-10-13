/**
 * Client-side WhatsApp checkout helper.
 * Calls the Next.js /api/checkout/whatsapp-order route to securely validate items,
 * calculate totals from the database, insert the order, and retrieve the prefilled WhatsApp link.
 */

export type CustomerPayload = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type CartItemPayload = {
  productId: number;
  slug?: string;
  name?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  size?: string | null;
  isMadeToMeasure?: boolean;
  measurements?: {
    chest?: string;
    waist?: string;
    shoulder?: string;
    sleeveLength?: string;
    garmentLength?: string;
    neck?: string;
  } | null;
  quantity: number;
};

export async function createWhatsAppCheckoutOrder({
  customer,
  items,
}: {
  customer: CustomerPayload;
  items: CartItemPayload[];
}) {
  const response = await fetch("/api/checkout/whatsapp-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customer, items }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      result.error ||
      (Array.isArray(result.details)
        ? result.details.map((d: { message?: string }) => d.message).filter(Boolean).join(", ")
        : null) ||
      "We couldn't create your order. Please try again.";
    throw new Error(errorMsg);
  }

  const { order, whatsappUrl } = result;

  if (!order?.orderNumber || !whatsappUrl) {
    throw new Error("The order response was incomplete. Please contact NAADE directly.");
  }

  return {
    order,
    whatsappUrl,
  };
}
