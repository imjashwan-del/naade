import { cache } from "react";
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

export const getSiteContent = cache(async function getSiteContent(
  pageId: SiteContentPageId,
) {
  try {
    const [saved] = await db
      .select({ content: siteContent.content })
      .from(siteContent)
      .where(eq(siteContent.pageId, pageId))
      .limit(1);

    return { ...defaults[pageId], ...(saved?.content ?? {}) };
  } catch (error) {
    console.error(`Failed to load site content for ${pageId}:`, error);
    return defaults[pageId];
  }
});

export async function getAllSiteContent() {
  try {
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
  } catch (error) {
    console.error("Failed to load all site content:", error);
    return defaults;
  }
}

