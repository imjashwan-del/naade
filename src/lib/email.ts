import { escapeHtml } from "@/lib/format";

type OrderStatusEmail = {
  orderNumber: string;
  customerName: string;
  email: string;
  orderStatus: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
};

export async function sendOrderStatusEmail(order: OrderStatusEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  if (!apiKey || !from) return false;

  const trackingText = [order.trackingCarrier, order.trackingNumber]
    .filter(Boolean)
    .join(" · ");
  const trackingHtml = order.trackingUrl
    ? `<p><a href="${escapeHtml(order.trackingUrl)}">Track your shipment</a></p>`
    : "";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [order.email],
      subject: `Order ${order.orderNumber}: ${order.orderStatus}`,
      text: [
        `Hello ${order.customerName},`,
        `Your order ${order.orderNumber} is now ${order.orderStatus}.`,
        trackingText ? `Tracking: ${trackingText}` : "",
        order.trackingUrl ? `Track it here: ${order.trackingUrl}` : "",
        "Thank you, NAADE",
      ]
        .filter(Boolean)
        .join("\n\n"),
      html: `<p>Hello ${escapeHtml(order.customerName)},</p><p>Your order <strong>${escapeHtml(order.orderNumber)}</strong> is now <strong>${escapeHtml(order.orderStatus)}</strong>.</p>${trackingText ? `<p>${escapeHtml(trackingText)}</p>` : ""}${trackingHtml}<p>Thank you,<br />NAADE</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected order email (${response.status}).`);
  }
  return true;
}