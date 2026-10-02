"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SITE_CONTENT_PAGES,
  type SiteContentPageId,
  type SiteContentValues,
} from "@/lib/site-content";

type SiteContentData = Record<SiteContentPageId, SiteContentValues>;

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
      setNotice("Image uploaded. Save this page to publish the change.");
    } catch {
      setError("Image upload failed. Check your connection and try again.");
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
          content: values[selectedPage],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to save page content.");
        return;
      }
      setNotice(`${page.title} content saved.`);
      router.refresh();
    } catch {
      setError(
        "Unable to save page content. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border border-[var(--color-line)] bg-white">
      <div className="flex flex-col gap-4 border-b border-[var(--color-line)] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <label className="block w-full max-w-sm">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/60">
            Page
          </span>
          <select
            value={selectedPage}
            onChange={(event) =>
              setSelectedPage(event.target.value as SiteContentPageId)
            }
            className="w-full border border-black/20 bg-white px-3 py-2.5 text-sm outline-none"
          >
            {SITE_CONTENT_PAGES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <a
          href={previewPath}
          target="_blank"
          rel="noreferrer"
          className="w-fit text-xs font-semibold uppercase tracking-[0.08em] underline underline-offset-4"
        >
          Preview {page.title}
        </a>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
          {page.fields.map((field) => (
            <label
              key={field.key}
              className={`block ${field.type === "textarea" || field.type === "image" ? "sm:col-span-2" : ""}`}
            >
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]/60">
                {field.label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={values[selectedPage][field.key] ?? ""}
                  onChange={(event) =>
                    updateField(field.key, event.target.value)
                  }
                  rows={3}
                  className="w-full border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-black/60"
                />
              ) : (
                <input
                  type="text"
                  value={values[selectedPage][field.key] ?? ""}
                  onChange={(event) =>
                    updateField(field.key, event.target.value)
                  }
                  className="w-full border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-black/60"
                />
              )}
              {field.type === "image" && (
                <span className="mt-2 flex flex-wrap items-center gap-3">
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
                    className="max-w-full text-xs text-[var(--color-charcoal)]/65 file:mr-3 file:border-0 file:bg-[var(--color-offwhite)] file:px-3 file:py-2 file:text-xs file:font-semibold"
                  />
                  {uploadingField === field.key && (
                    <span className="text-xs text-[var(--color-charcoal)]/55">
                      Uploading…
                    </span>
                  )}
                </span>
              )}
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-line)] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p aria-live="polite" className="min-h-5 text-sm">
            {error ? (
              <span className="text-red-700">{error}</span>
            ) : notice ? (
              <span className="text-green-800">{notice}</span>
            ) : null}
          </p>
          <button
            type="submit"
            disabled={saving || uploadingField !== null}
            className="bg-[var(--color-charcoal)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save page content"}
          </button>
        </div>
      </form>
    </section>
  );
}
