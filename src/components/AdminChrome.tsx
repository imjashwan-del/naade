"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[var(--color-ivory)]">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <header className="border-b border-[var(--color-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="font-serif-display text-lg tracking-[0.06em]"
            >
              NAADE Admin
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/admin"
                className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                  pathname === "/admin"
                    ? "text-[var(--color-charcoal)]"
                    : "text-[var(--color-charcoal)]/50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                  pathname?.startsWith("/admin/products")
                    ? "text-[var(--color-charcoal)]"
                    : "text-[var(--color-charcoal)]/50"
                }`}
              >
                Products
              </Link>
              <Link
                href="/admin/content"
                className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                  pathname?.startsWith("/admin/content")
                    ? "text-[var(--color-charcoal)]"
                    : "text-[var(--color-charcoal)]/50"
                }`}
              >
                Content
              </Link>
              <Link
                href="/admin/orders"
                className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                  pathname?.startsWith("/admin/orders")
                    ? "text-[var(--color-charcoal)]"
                    : "text-[var(--color-charcoal)]/50"
                }`}
              >
                Orders
              </Link>
              <Link
                href="/admin/pending-payments"
                className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                  pathname?.startsWith("/admin/pending-payments")
                    ? "text-[var(--color-charcoal)]"
                    : "text-[var(--color-charcoal)]/50"
                }`}
              >
                Pending Payments
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.1em] text-[var(--color-charcoal)]/50"
            >
              View Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-maroon)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
