import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG or WEBP images are allowed" }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be smaller than 8MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl || supabaseKey) {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Configure both Supabase URL and service role key for image storage." },
        { status: 503 },
      );
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
    const baseUrl = supabaseUrl.replace(/\/$/, "");
    const uploadUrl = `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${filename}`;
    const upload = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: buffer,
    });

    if (!upload.ok) {
      console.error("Supabase image upload failed:", upload.status, await upload.text());
      return NextResponse.json({ error: "Image storage upload failed." }, { status: 502 });
    }

    return NextResponse.json({
      url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${filename}`,
    });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Configure Supabase Storage before uploading production images." },
      { status: 503 },
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
