"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function toggleActive(product: Product) {
    setActionError(null);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    if (!res.ok) {
      setActionError("Unable to update product status. Please try again.");
      return;
    }
    load();
  }

  async function deleteProduct(product: Product) {
    if (
      !window.confirm(
        `Permanently delete "${product.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setActionError(null);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setActionError("Unable to delete product. Please try again.");
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          New Product
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-black/50">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-black/50">
          No products yet. Create your first product.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          {actionError ? (
            <p role="alert" className="mb-4 text-sm text-[var(--color-maroon)]">
              {actionError}
            </p>
          ) : null}
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-[11px] uppercase tracking-[0.08em] text-black/50">
                <th className="py-3">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Inventory</th>
                <th className="py-3">Status</th>
                <th className="py-3">Flags</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-black/5">
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4 capitalize">{product.category}</td>
                  <td className="py-3 pr-4">{formatPrice(product.price)}</td>
                  <td className="py-3 pr-4">{product.inventoryQuantity}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        product.isActive ? "text-green-700" : "text-black/40"
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-black/50">
                    {[
                      product.isFeatured && "Featured",
                      product.isNewArrival && "New",
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-xs font-semibold uppercase text-black/70 underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleActive(product)}
                        className="text-xs font-semibold uppercase text-[var(--color-maroon)]"
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteProduct(product)}
                        aria-label={`Delete ${product.name}`}
                        className="text-xs font-semibold uppercase text-[var(--color-maroon)] underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
