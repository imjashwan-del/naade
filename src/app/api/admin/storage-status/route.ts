import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

  const hasUrl = Boolean(supabaseUrl);
  const hasServiceRoleKey = Boolean(supabaseKey);

  if (!hasUrl) {
    return NextResponse.json({
      configured: false,
      hasUrl: false,
      hasServiceRoleKey: false,
      bucket,
      status: "missing_url",
      message: "NEXT_PUBLIC_SUPABASE_URL is not configured in environment variables.",
    });
  }

  if (!hasServiceRoleKey) {
    return NextResponse.json({
      configured: false,
      hasUrl: true,
      hasServiceRoleKey: false,
      bucket,
      status: "missing_service_role_key",
      message:
        "SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Set this environment variable in your deployment settings.",
    });
  }

  try {
    const baseUrl = supabaseUrl!.replace(/\/$/, "");
    const res = await fetch(
      `${baseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`,
      {
        headers: {
          apikey: supabaseKey!,
          Authorization: `Bearer ${supabaseKey!}`,
        },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (res.ok) {
      return NextResponse.json({
        configured: true,
        hasUrl: true,
        hasServiceRoleKey: true,
        bucket,
        status: "ready",
        message: `Supabase Storage connected and bucket '${bucket}' is ready.`,
      });
    }

    const errText = await res.text().catch(() => "");
    return NextResponse.json({
      configured: false,
      hasUrl: true,
      hasServiceRoleKey: true,
      bucket,
      status: "storage_error",
      message: `Supabase Storage returned HTTP ${res.status}: ${errText.slice(0, 150)}`,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      configured: false,
      hasUrl: true,
      hasServiceRoleKey: true,
      bucket,
      status: "connection_error",
      message:
        err instanceof Error
          ? err.message
          : "Could not establish connection to Supabase Storage endpoint.",
    });
  }
}
