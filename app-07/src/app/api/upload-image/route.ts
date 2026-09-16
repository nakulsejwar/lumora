import { NextResponse } from "next/server";

/**
 * Central Next.js API proxy route for image uploads.
 * Forwards file uploads to Django backend's central Cloudinary API (`POST /lumora/upload-image/`).
 * All Cloudinary API keys & secrets remain 100% server-side on the Django backend.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const key = formData.get("key") as string;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "No image file received" }, { status: 400 });
    }

    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const backendUrl = `${backendBaseUrl.replace(/\/$/, "")}/lumora/upload-image/`;

    const backendForm = new FormData();
    backendForm.append("file", file);
    if (key) {
      backendForm.append("key", key);
    }
    if (folder) {
      backendForm.append("folder", folder);
    }

    const res = await fetch(backendUrl, {
      method: "POST",
      body: backendForm,
    });

    const data = await res.json();
    if (!res.ok || data?.status !== "success" || !data?.url) {
      return NextResponse.json(
        { error: data?.error || "Image upload to Cloudinary failed on backend" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url,
    });
  } catch (err: any) {
    console.error("[Upload Image Proxy Error]:", err);
    return NextResponse.json(
      { error: "Image upload failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
