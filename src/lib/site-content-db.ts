import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import {
  SITE_CONTENT_PAGES,
  type SiteContentPageId,
  type SiteContentValues,
} from "@/lib/site-content";

const defaults = Object.fromEntries(
  SITE_CONTENT_PAGES.map((page) => [
    page.id,
    Object.fromEntries(
      page.fields.map((field) => [field.key, field.defaultValue]),
    ),
  ]),
) as Record<SiteContentPageId, SiteContentValues>;

export async function getSiteContent(pageId: SiteContentPageId) {
  const [saved] = await db
    .select({ content: siteContent.content })
    .from(siteContent)
    .where(eq(siteContent.pageId, pageId))
    .limit(1);

  return { ...defaults[pageId], ...(saved?.content ?? {}) };
}

export async function getAllSiteContent() {
  const savedRows = await db.select().from(siteContent);
  const savedContent = new Map(
    savedRows.map((row) => [row.pageId, row.content]),
  );

  return Object.fromEntries(
    SITE_CONTENT_PAGES.map((page) => [
      page.id,
      { ...defaults[page.id], ...(savedContent.get(page.id) ?? {}) },
    ]),
  ) as Record<SiteContentPageId, SiteContentValues>;
}
