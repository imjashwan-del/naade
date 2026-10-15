"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  SITE_CONTENT_PAGES,
  type SiteContentPageId,
  type SiteContentValues,
} from "@/lib/site-content";

type SiteContentData = Record<SiteContentPageId, SiteContentValues>;

type StorageStatus = {
  configured: boolean;
  hasUrl: boolean;
  hasServiceRoleKey: boolean;
  bucket: string;
  status: string;
  message: string;
};

export function SiteContentEditor({
  initialValues,
}: {
  initialValues: SiteContentData;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [selectedPage, setSelectedPage] = useState<SiteContentPageId>("home");
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/storage-status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StorageStatus | null) => {
        if (active && data) setStorageStatus(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const page = SITE_CONTENT_PAGES.find((item) => item.id === selectedPage)!;
  const previewPath =
    selectedPage === "home" || selectedPage === "global"
      ? "/"
      : `/${selectedPage}`;

  function updateField(key: string, value: string) {
    setValues((previous) => ({
      ...previous,
      [selectedPage]: { ...previous[selectedPage], [key]: value },
    }));
  }

  async function uploadImage(key: string, file: File) {
    setError(null);
    setNotice(null);
    setUploadingField(key);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Image upload failed.");
        return;
      }
      updateField(key, data.url);
      setNotice("Image uploaded. Click 'Save page content' to publish.");
    } catch {
      setError("Image upload failed. Check connection and try again.");
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: selectedPage,
          content: values[selectedPage] ?? {},
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to save page content.");
        return;
      }
      setNotice(`Saved ${page.title} content successfully.`);
      router.refresh();
    } catch {
      setError(
        "Unable to save page content. Check connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border border-[var(--color-line)] bg-white shadow-sm">
      {/* Category selector chips */}
      <div className="border-b border-[var(--color-line)] bg-[var(--color-offwhite)]/50 p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]/60">
          Select Section to Edit
        </p>
        <div className="flex flex-wrap gap-2">
          {SITE_CONTENT_PAGES.map((item) => {
            const isSelected = item.id === selectedPage;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedPage(item.id);
                  setError(null);
                  setNotice(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
                  isSelected
                    ? "bg-[var(--color-charcoal)] text-[var(--color-ivory)]"
                    : "border border-black/15 bg-white text-[var(--color-charcoal)]/80 hover:bg-black/5"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-[var(--color-line)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-serif-display text-xl text-[var(--color-charcoal)]">
            Editing {page.title}
          </h2>
          <p className="text-xs text-[var(--color-charcoal)]/60">
            {page.fields.length} editable fields for this section
          </p>
        </div>
        <a
          href={previewPath}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-maroon)] underline underline-offset-4 hover:opacity-80"
        >
          View Live {page.title} ↗
        </a>
      </div>

      <form onSubmit={handleSubmit}>
        {storageStatus && !storageStatus.configured && page.fields.some((f) => f.type === "image") && (
          <div className="mx-5 mt-5 rounded border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-950 sm:mx-6">
            <div className="flex items-start gap-2.5">
              <span className="text-sm">⚠️</span>
              <div className="space-y-1">
                <p className="font-semibold text-amber-900">
                  Image Uploads Require Server Configuration
                </p>
                <p className="leading-relaxed text-amber-800">
                  Direct image uploads require{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px] font-semibold text-amber-900">
                    SUPABASE_SERVICE_ROLE_KEY
                  </code>{" "}
                  in your server environment settings (.env.local or Vercel). You can also paste an image path or external URL directly into the field.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6">
          {page.fields.map((field) => {
            const currentValue = values[selectedPage]?.[field.key] ?? "";
            const isImage = field.type === "image";
            const isTextarea = field.type === "textarea";

            return (
              <div
                key={field.key}
                className={`block ${isTextarea || isImage ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`field-${field.key}`}
                    className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/70"
                  >
                    {field.label}
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-charcoal)]/40">
                    {field.key}
                  </span>
                </div>

                {isTextarea ? (
                  <textarea
                    id={`field-${field.key}`}
                    value={currentValue}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                    rows={field.key.includes("Copy") || field.key.includes("Description") || field.key.startsWith("a") ? 4 : 2}
                    className="mt-2 w-full border border-black/20 bg-white p-3 text-sm leading-relaxed text-[var(--color-charcoal)] outline-none focus:border-[var(--color-charcoal)] focus:ring-1 focus:ring-[var(--color-charcoal)]"
                  />
                ) : (
                  <input
                    id={`field-${field.key}`}
                    type="text"
                    value={currentValue}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                    className="mt-2 w-full border border-black/20 bg-white px-3 py-2 text-sm text-[var(--color-charcoal)] outline-none focus:border-[var(--color-charcoal)] focus:ring-1 focus:ring-[var(--color-charcoal)]"
                  />
                )}

                {isImage && (
                  <div className="mt-3 flex flex-wrap items-center gap-4 rounded border border-[var(--color-line)] bg-[var(--color-offwhite)]/30 p-3">
                    {currentValue ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-black/15 bg-white">
                        <Image
                          src={currentValue}
                          alt="Preview"
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-dashed border-black/20 text-[10px] text-black/40">
                        No image
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium text-[var(--color-charcoal)]">
                        Upload replacement image:
                      </p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        aria-label={`Upload ${field.label.toLowerCase()}`}
                        disabled={uploadingField === field.key}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadImage(field.key, file);
                          event.target.value = "";
                        }}
                        className="max-w-full text-xs text-[var(--color-charcoal)]/75 file:mr-3 file:border-0 file:bg-[var(--color-charcoal)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-white"
                      />
                      {uploadingField === field.key && (
                        <p className="text-xs font-semibold text-[var(--color-maroon)]">
                          Uploading image…
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[var(--color-line)] bg-white/95 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p aria-live="polite" className="min-h-5 text-sm font-medium">
            {error ? (
              <span className="text-[var(--color-maroon)]">✕ {error}</span>
            ) : notice ? (
              <span className="text-emerald-800">✓ {notice}</span>
            ) : null}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                const defaults = Object.fromEntries(
                  page.fields.map((f) => [f.key, f.defaultValue])
                );
                setValues((prev) => ({
                  ...prev,
                  [selectedPage]: defaults,
                }));
                setNotice(`Reset fields to initial defaults. Click Save to apply.`);
              }}
              className="border border-black/20 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)] hover:bg-black/5"
            >
              Reset to Defaults
            </button>
            <button
              type="submit"
              disabled={saving || uploadingField !== null}
              className="bg-[var(--color-charcoal)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)] hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Page Content"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
