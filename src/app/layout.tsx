import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SiteChrome } from "@/components/SiteChrome";
import { getSiteContent } from "@/lib/site-content-db";

export const dynamic = "force-dynamic";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "NAADE — Contemporary Ikat from Pochampally",
  description:
    "NAADE is premium contemporary menswear crafted from Pochampally Ikat, handwoven in Telangana, India.",
  openGraph: {
    type: "website",
    siteName: "NAADE",
    title: "NAADE — Contemporary Ikat from Pochampally",
    description:
      "Contemporary menswear crafted from Pochampally Ikat, handwoven in Telangana, India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NAADE — Contemporary Ikat from Pochampally",
    description:
      "Contemporary menswear crafted from Pochampally Ikat, handwoven in Telangana, India.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const globalContent = await getSiteContent("global");
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-[var(--color-ivory)] font-sans text-[var(--color-charcoal)] antialiased">
        <CartProvider>
          <SiteChrome globalContent={globalContent}>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
