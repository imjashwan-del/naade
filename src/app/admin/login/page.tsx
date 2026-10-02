"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session").then((res) => {
      if (res.ok) router.replace("/admin/products");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Unable to sign in. Please try again.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError(
        "Unable to reach the server. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-[var(--color-line)] bg-white p-8"
      >
        <p className="font-serif-display text-2xl tracking-[0.06em] text-[var(--color-charcoal)]">
          NAADE
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-charcoal)]/50">
          Admin Login
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)]/70">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[var(--color-charcoal)]/25 px-3 py-2.5 text-sm outline-none focus:border-[var(--color-charcoal)]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)]/70">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[var(--color-charcoal)]/25 px-3 py-2.5 text-sm outline-none focus:border-[var(--color-charcoal)]"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-[var(--color-maroon)]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-[var(--color-charcoal)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] hover:bg-black disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
