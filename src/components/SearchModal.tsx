"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/db/schema";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (active) {
          setResults(data.products || []);
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search garments"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-ivory)] shadow-2xl transition-all">
        {/* Search header & input */}
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-5 py-4">
          <svg
            className="h-5 w-5 text-[var(--color-charcoal)]/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Jackets, Shirts, Pochampally Ikat cloth..."
            className="w-full bg-transparent text-base text-[var(--color-charcoal)] placeholder:text-[var(--color-charcoal)]/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-black/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-charcoal)]/60 hover:bg-black/5"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <p className="py-8 text-center text-xs uppercase tracking-widest text-[var(--color-charcoal)]/50">
              Searching handloom pieces…
            </p>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/50">
                {query ? `Results for "${query}" (${results.length})` : "Featured Collection"}
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-4 rounded border border-transparent p-2.5 transition-colors hover:border-[var(--color-line)] hover:bg-[var(--color-offwhite)]/60"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-[var(--color-offwhite)]">
                    <Image
                      src={product.mainImageUrl}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-maroon)]">
                        {product.category}
                      </span>
                      {product.customMeasurementsEnabled && (
                        <span className="text-[10px] text-[var(--color-charcoal)]/40">
                          • Made to Measure
                        </span>
                      )}
                    </div>
                    <h4 className="truncate font-serif-display text-sm text-[var(--color-charcoal)]">
                      {product.name}
                    </h4>
                    <p className="truncate text-xs text-[var(--color-charcoal)]/60">
                      {product.clothName || product.weaveType || product.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-[var(--color-charcoal)] text-sm">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="font-serif-display text-lg text-[var(--color-charcoal)]">
                No pieces found
              </p>
              <p className="mt-1 text-xs text-[var(--color-charcoal)]/60">
                Try searching for &ldquo;Jacket&rdquo;, &ldquo;Shirt&rdquo;, or &ldquo;Ikat&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[var(--color-line)] bg-[var(--color-offwhite)]/40 px-5 py-2.5 text-[11px] text-[var(--color-charcoal)]/50">
          <span>Navigate with arrow keys</span>
          <Link
            href="/shop"
            onClick={onClose}
            className="font-semibold uppercase tracking-wider text-[var(--color-charcoal)] hover:underline"
          >
            Browse all products →
          </Link>
        </div>
      </div>
    </div>
  );
}
