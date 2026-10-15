import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  // 1. Authorization: Only authenticated admins can upload images
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required to upload images." },
      { status: 401 },
    );
  }

  // 2. Parse and validate multipart form
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG or WEBP images are allowed." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image file must be smaller than 8MB." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;

  // 3. Supabase Storage configuration check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

  if (supabaseUrl || supabaseKey) {
    if (!supabaseUrl) {
      return NextResponse.json(
        {
          error:
            "Supabase Storage configuration required: NEXT_PUBLIC_SUPABASE_URL is missing. Please configure it in your environment variables.",
        },
        { status: 503 },
      );
    }

    if (!supabaseKey) {
      return NextResponse.json(
        {
          error:
            "Supabase Storage configuration required: SUPABASE_SERVICE_ROLE_KEY is missing on the server. Please add this secret environment variable in your deployment settings (.env.local or Vercel).",
        },
        { status: 503 },
      );
    }

    const baseUrl = supabaseUrl.replace(/\/$/, "");
    const uploadUrl = `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${filename}`;

    try {
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
        const errorText = await upload.text().catch(() => "");
        console.error("Supabase image upload failed:", upload.status, errorText);

        if (upload.status === 401 || upload.status === 403) {
          return NextResponse.json(
            { error: "Supabase authorization failed. Check your SUPABASE_SERVICE_ROLE_KEY." },
            { status: 502 },
          );
        }

        if (upload.status === 404) {
          return NextResponse.json(
            {
              error: `Supabase Storage bucket '${bucket}' was not found. Please create it or run 'node scripts/ensure-storage-bucket.cjs'.`,
            },
            { status: 502 },
          );
        }

        return NextResponse.json(
          { error: `Supabase Storage upload failed (HTTP ${upload.status}).` },
          { status: 502 },
        );
      }

      return NextResponse.json({
        url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${filename}`,
      });
    } catch (err: unknown) {
      console.error("Supabase Storage connection failed:", err);
      return NextResponse.json(
        { error: "Failed to connect to Supabase Storage. Check network connection." },
        { status: 502 },
      );
    }
  }

  // 4. Production guard if Supabase is not configured
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Supabase Storage is not configured on the production server. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  // 5. Local development fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}

export async function DELETE(req: NextRequest) {
  // 1. Authorization: Only authenticated admins can delete images
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const url = (body?.url as string) || req.nextUrl.searchParams.get("url");

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

  // Check if URL belongs to Supabase Storage
  if (supabaseUrl && url.startsWith(supabaseUrl.replace(/\/$/, ""))) {
    if (!supabaseKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY missing on server to delete image." },
        { status: 503 },
      );
    }

    const baseUrl = supabaseUrl.replace(/\/$/, "");
    const publicPrefix = `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/`;

    if (url.startsWith(publicPrefix)) {
      const filename = url.slice(publicPrefix.length);
      const deleteUrl = `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${filename}`;

      try {
        const delRes = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });

        if (!delRes.ok && delRes.status !== 404) {
          const errText = await delRes.text().catch(() => "");
          console.error("Supabase Storage delete failed:", delRes.status, errText);
          return NextResponse.json(
            { error: `Failed to remove image from Supabase Storage (HTTP ${delRes.status}).` },
            { status: 502 },
          );
        }

        return NextResponse.json({ success: true, message: "Image removed from Supabase Storage." });
      } catch (err: unknown) {
        console.error("Supabase Storage delete error:", err);
        return NextResponse.json(
          { error: "Failed to connect to Supabase Storage to delete image." },
          { status: 502 },
        );
      }
    }
  }

  // Check if URL is local upload
  if (url.startsWith("/uploads/")) {
    const filename = path.basename(url);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    try {
      await unlink(filePath);
      return NextResponse.json({ success: true, message: "Local image removed." });
    } catch {
      // If file doesn't exist or already removed, ignore
      return NextResponse.json({ success: true, message: "Image removed." });
    }
  }

  return NextResponse.json({ success: true, message: "Image unlinked." });
}
