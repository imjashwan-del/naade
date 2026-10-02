import Link from "next/link";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";
import { getAllSiteContent } from "@/lib/site-content-db";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await getAllSiteContent();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-maroon)]">
            Store appearance
          </p>
          <h1 className="mt-2 font-serif-display text-3xl text-[var(--color-charcoal)]">
            Site content
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-charcoal)]/60">
            Edit customer-facing text and images. Page layouts and store
            functionality stay unchanged.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="w-fit border border-[var(--color-charcoal)]/25 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]"
        >
          Preview store
        </Link>
      </header>
      <SiteContentEditor initialValues={content} />
    </div>
  );
}
