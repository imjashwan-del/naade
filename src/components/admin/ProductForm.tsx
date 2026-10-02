"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/db/schema";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export type ProductFormValues = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  productCode: string;
  clothName: string;
  weaveType: string;
  colourStory: string;
  craftStory: string;
  mainImageUrl: string;
  galleryImages: string[];
  images: string[];
  availableSizes: string[];
  customMeasurementsEnabled: boolean;
  inventoryQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  sortOrder: number;
};

function toFormValues(product?: Product): ProductFormValues {
  if (!product) {
    return {
      name: "",
      slug: "",
      category: "jacket",
      description: "",
      price: 0,
      productCode: "",
      clothName: "",
      weaveType: "",
      colourStory: "",
      craftStory: "",
      mainImageUrl: "",
      galleryImages: [],
      images: [],
      availableSizes: ["S", "M", "L", "XL"],
      customMeasurementsEnabled: false,
      inventoryQuantity: 0,
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      sortOrder: 0,
    };
  }
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    price: product.price,
    productCode: product.productCode,
    clothName: product.clothName,
    weaveType: product.weaveType,
    colourStory: product.colourStory,
    craftStory: product.craftStory,
    mainImageUrl: product.mainImageUrl,
    galleryImages: product.galleryImages ?? [],
    images: product.images ?? [],
    availableSizes: product.availableSizes ?? [],
    customMeasurementsEnabled: product.customMeasurementsEnabled,
    inventoryQuantity: product.inventoryQuantity,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    sortOrder: product.sortOrder,
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    toFormValues(product),
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSize(size: string) {
    set(
      "availableSizes",
      values.availableSizes.includes(size)
        ? values.availableSizes.filter((s) => s !== size)
        : [...values.availableSizes, size],
    );
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    if (!values.mainImageUrl) {
      set("mainImageUrl", data.url);
    }
    set("galleryImages", [...values.galleryImages, data.url]);
    set("images", [...values.images, data.url]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...values,
      price: Number(values.price),
      inventoryQuantity: Number(values.inventoryQuantity),
      sortOrder: Number(values.sortOrder),
    };

    const endpoint = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      const fieldErrors = Object.entries(data.issues?.fieldErrors ?? {})
        .flatMap(([field, messages]) =>
          Array.isArray(messages)
            ? messages.map((message: string) => `${field}: ${message}`)
            : [],
        )
        .join(" ");
      setError(fieldErrors || data.error || "Unable to save product");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          value={values.name}
          onChange={(v) => set("name", v)}
          required
        />
        <TextField
          label="Slug"
          value={values.slug}
          onChange={(value) =>
            set(
              "slug",
              value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
            )
          }
          required
        />
        <div>
          <FieldLabel>Category</FieldLabel>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full border border-black/20 px-3 py-2.5 text-sm outline-none"
          >
            <option value="jacket">Jacket</option>
            <option value="shirt">Shirt</option>
          </select>
        </div>
        <TextField
          label="Product Code"
          value={values.productCode}
          onChange={(v) => set("productCode", v)}
          required
        />
        <TextField
          label="Price (INR)"
          type="number"
          value={String(values.price)}
          onChange={(v) => set("price", Number(v))}
          required
        />
        <TextField
          label="Inventory Quantity"
          type="number"
          value={String(values.inventoryQuantity)}
          onChange={(v) => set("inventoryQuantity", Number(v))}
        />
        <TextField
          label="Sort Order"
          type="number"
          value={String(values.sortOrder)}
          onChange={(v) => set("sortOrder", Number(v))}
        />
      </section>

      <section>
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full border border-black/20 px-3 py-2.5 text-sm outline-none"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Cloth Name"
          value={values.clothName}
          onChange={(v) => set("clothName", v)}
        />
        <TextField
          label="Weave Type"
          value={values.weaveType}
          onChange={(v) => set("weaveType", v)}
        />
        <TextField
          label="Colour Story"
          value={values.colourStory}
          onChange={(v) => set("colourStory", v)}
        />
      </section>

      <section>
        <FieldLabel>Craft Story</FieldLabel>
        <textarea
          value={values.craftStory}
          onChange={(e) => set("craftStory", e.target.value)}
          rows={2}
          className="w-full border border-black/20 px-3 py-2.5 text-sm outline-none"
        />
      </section>

      <section>
        <FieldLabel>Images</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {values.galleryImages.map((img, i) => (
            <div
              key={img + i}
              className="relative h-20 w-20 overflow-hidden border border-black/10"
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  set(
                    "galleryImages",
                    values.galleryImages.filter((_, idx) => idx !== i),
                  );
                  set(
                    "images",
                    values.images.filter((_, idx) => idx !== i),
                  );
                  if (values.mainImageUrl === img)
                    set("mainImageUrl", values.galleryImages[0] ?? "");
                }}
                className="absolute right-0 top-0 bg-black/70 px-1 text-[10px] text-white"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 items-center justify-center border border-dashed border-black/30 text-[11px] text-black/50"
          >
            {uploading ? "…" : "+ Upload"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = "";
            }}
          />
        </div>
        <TextField
          label="Main Image URL"
          value={values.mainImageUrl}
          onChange={(v) => set("mainImageUrl", v)}
          hint="Set automatically from the first uploaded image, or paste a path."
          required
        />
      </section>

      <section>
        <FieldLabel>Available Sizes</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase ${
                values.availableSizes.includes(size)
                  ? "bg-black text-white"
                  : "border border-black/20 text-black/60"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Checkbox
          label="Custom measurements enabled"
          checked={values.customMeasurementsEnabled}
          onChange={(v) => set("customMeasurementsEnabled", v)}
        />
        <Checkbox
          label="Active"
          checked={values.isActive}
          onChange={(v) => set("isActive", v)}
        />
        <Checkbox
          label="Featured"
          checked={values.isFeatured}
          onChange={(v) => set("isFeatured", v)}
        />
        <Checkbox
          label="New Arrival"
          checked={values.isNewArrival}
          onChange={(v) => set("isNewArrival", v)}
        />
      </section>

      {error ? (
        <p className="text-sm text-[var(--color-maroon)]">{error}</p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/60">
      {children}
    </p>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex flex-col">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-black"
      />
      {hint ? (
        <span className="mt-1 text-[11px] text-black/40">{hint}</span>
      ) : null}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-black/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
