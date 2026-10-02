"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { EMPTY_MEASUREMENTS, Measurements, measurementsAreComplete } from "@/lib/cart-types";
import { SizeSelector } from "./SizeSelector";
import { MeasurementForm } from "./MeasurementForm";
import { Button } from "./Button";
import { formatPrice } from "@/lib/format";

type ProductForCart = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  mainImageUrl: string;
  availableSizes: string[];
  customMeasurementsEnabled: boolean;
  inventoryQuantity: number;
};

export function AddToBagPanel({ product }: { product: ProductForCart }) {
  const { addItem } = useCart();
  const hasStandardSizes = product.availableSizes.length > 0;
  const [mode, setMode] = useState<"standard" | "measure">(
    hasStandardSizes ? "standard" : "measure"
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>(EMPTY_MEASUREMENTS);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.inventoryQuantity <= 0;

  const measurementErrors = useMemo(() => {
    if (mode !== "measure") return {};
    const errs: Partial<Record<keyof Measurements, string>> = {};
    (Object.keys(measurements) as (keyof Measurements)[]).forEach((key) => {
      const value = measurements[key]?.trim();
      if (!value || !(Number(value) > 0)) {
        errs[key] = "Required";
      }
    });
    return errs;
  }, [measurements, mode]);

  function handleMeasurementChange(key: keyof Measurements, value: string) {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setJustAdded(false);
  }

  function handleAddToBag() {
    setJustAdded(false);
    if (outOfStock) {
      setError("This piece is currently out of stock.");
      return;
    }
    if (mode === "standard") {
      if (!selectedSize) {
        setError("Please select a size.");
        return;
      }
    } else {
      if (!measurementsAreComplete(measurements)) {
        setError("Please complete all measurement fields before adding to bag.");
        return;
      }
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.mainImageUrl,
      size: mode === "standard" ? selectedSize : null,
      isMadeToMeasure: mode === "measure",
      measurements: mode === "measure" ? measurements : null,
      quantity,
    });
    setError(null);
    setJustAdded(true);
  }

  return (
    <div className="flex flex-col gap-7">
      {hasStandardSizes && product.customMeasurementsEnabled ? (
        <div className="flex gap-2 border border-[var(--color-charcoal)]/20 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("standard");
              setJustAdded(false);
            }}
            className={`flex-1 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              mode === "standard"
                ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
                : "text-[var(--color-charcoal)]/60"
            }`}
          >
            Standard Size
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("measure");
              setJustAdded(false);
            }}
            className={`flex-1 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              mode === "measure"
                ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
                : "text-[var(--color-charcoal)]/60"
            }`}
          >
            Make It To My Measurements
          </button>
        </div>
      ) : null}

      {mode === "standard" && hasStandardSizes ? (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Select Size
          </p>
          <SizeSelector
            sizes={product.availableSizes}
            selected={selectedSize}
            onSelect={(size) => {
              setSelectedSize(size);
              setError(null);
              setJustAdded(false);
            }}
          />
        </div>
      ) : null}

      {mode === "measure" ? (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Your Measurements
          </p>
          <MeasurementForm
            values={measurements}
            onChange={handleMeasurementChange}
            errors={measurementErrors}
          />
        </div>
      ) : null}

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
          Quantity
        </p>
        <div className="flex h-11 w-32 items-center justify-between border border-[var(--color-charcoal)]/25">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-full w-11 text-lg text-[var(--color-charcoal)]"
          >
            −
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="h-full w-11 text-lg text-[var(--color-charcoal)]"
          >
            +
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-[var(--color-maroon)]">{error}</p> : null}
      {justAdded ? (
        <p className="text-sm text-[var(--color-charcoal)]">
          Added to bag.{" "}
          <Link href="/cart" className="underline underline-offset-4">
            View Bag
          </Link>
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleAddToBag}
        disabled={outOfStock}
        className="w-full sm:w-auto"
      >
        {outOfStock ? "Out of Stock" : `Add to Bag — ${formatPrice(product.price * quantity)}`}
      </Button>
    </div>
  );
}
