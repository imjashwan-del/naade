import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { SITE_CONTENT_PAGES } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  page: z.string(),
  content: z.record(z.string(), z.string().max(5000)),
});

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid page content." },
      { status: 400 },
    );
  }

  const page = SITE_CONTENT_PAGES.find((item) => item.id === parsed.data.page);
  if (!page) {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }

  const allowedFields = new Set<string>(page.fields.map((field) => field.key));
  const entries = Object.entries(parsed.data.content);
  if (
    entries.length !== allowedFields.size ||
    entries.some(([key, value]) => {
      if (!allowedFields.has(key)) return true;
      const field = page.fields.find((item) => item.key === key);
      return (
        field?.type === "image" &&
        value !== "" &&
        !value.startsWith("/") &&
        !/^https?:\/\//i.test(value)
      );
    })
  ) {
    return NextResponse.json(
      { error: "Page content contains invalid fields." },
      { status: 400 },
    );
  }

  await db
    .insert(siteContent)
    .values({
      pageId: page.id,
      content: parsed.data.content,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteContent.pageId,
      set: { content: parsed.data.content, updatedAt: new Date() },
    });

  return NextResponse.json({ saved: true });
}
