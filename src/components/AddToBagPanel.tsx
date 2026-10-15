"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { EMPTY_MEASUREMENTS, Measurements, measurementsAreComplete } from "@/lib/cart-types";
import { SizeSelector } from "./SizeSelector";
import { MeasurementForm } from "./MeasurementForm";
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
      setError("This piece is currently archived / out of stock.");
      return;
    }
    if (mode === "standard") {
      if (!selectedSize) {
        setError("Please select a standard size.");
        return;
      }
    } else {
      if (!measurementsAreComplete(measurements)) {
        setError("Please complete all measurement fields before proceeding.");
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
        <div className="flex gap-2 border border-[var(--color-line)] bg-[var(--color-parchment)] p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setMode("standard");
              setJustAdded(false);
            }}
            className={`flex-1 px-4 py-2.5 font-serif text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              mode === "standard"
                ? "border border-[var(--color-oxblood)] bg-[var(--color-oxblood)] text-[#f5efe6] shadow-xs"
                : "text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)]"
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
            className={`flex-1 px-4 py-2.5 font-serif text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              mode === "measure"
                ? "border border-[var(--color-oxblood)] bg-[var(--color-oxblood)] text-[#f5efe6] shadow-xs"
                : "text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)]"
            }`}
          >
            Made To Measure (Custom Fit)
          </button>
        </div>
      ) : null}

      {mode === "standard" && hasStandardSizes ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)]">
              Select Size
            </p>
            <Link
              href="/size-guide"
              target="_blank"
              className="font-serif text-xs text-[var(--color-oxblood)] underline underline-offset-4 hover:text-black"
            >
              Size Guide &nearr;
            </Link>
          </div>
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
        <div className="border border-[var(--color-line)] bg-[var(--color-parchment)] p-5">
          <div className="mb-4 flex items-center justify-between border-b border-[var(--color-line)] pb-3">
            <div>
              <p className="font-serif text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-oxblood)]">
                Custom Tailoring Proportions (Inches)
              </p>
              <p className="mt-1 text-[11px] text-[var(--color-charcoal)]/75">
                Cut individually from single cloth lengths in Pochampally with zero surcharge.
              </p>
            </div>
          </div>
          <MeasurementForm
            values={measurements}
            onChange={handleMeasurementChange}
            errors={measurementErrors}
          />
        </div>
      ) : null}

      <div>
        <p className="mb-3 font-serif text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-charcoal)]">
          Quantity
        </p>
        <div className="flex h-11 w-32 items-center justify-between border border-[var(--color-line)] bg-[var(--color-parchment)]">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-full w-11 text-lg text-[var(--color-charcoal)] hover:bg-[var(--color-cotton)]"
          >
            &minus;
          </button>
          <span className="font-serif text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="h-full w-11 text-lg text-[var(--color-charcoal)] hover:bg-[var(--color-cotton)]"
          >
            &#43;
          </button>
        </div>
      </div>

      {error ? (
        <div className="border border-[var(--color-oxblood)]/30 bg-[var(--color-oxblood)]/5 p-3 font-serif text-xs text-[var(--color-oxblood)]">
          {error}
        </div>
      ) : null}

      {justAdded ? (
        <div className="border border-[#3d5a3d]/30 bg-[#3d5a3d]/10 p-3 font-serif text-xs text-[#2b422b]">
          Piece added to bag.{" "}
          <Link href="/cart" className="font-semibold underline underline-offset-4">
            Proceed to Bag &rarr;
          </Link>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleAddToBag}
        disabled={outOfStock}
        className="w-full sm:w-auto border border-[var(--color-charcoal)] bg-[var(--color-charcoal)] px-8 py-4 font-serif text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ivory)] transition-all hover:border-[var(--color-oxblood)] hover:bg-[var(--color-oxblood)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {outOfStock
          ? "Piece Archived"
          : `Add to Bag — ${formatPrice(product.price * quantity)}`}
      </button>
    </div>
  );
}
