import { NextRequest, NextResponse } from "next/server";
import { getHomeGallery, saveHomeGallery } from "@/lib/homeGalleryStore";

export async function GET() {
  const data = await getHomeGallery();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { images?: string[] } | null;

  if (!body || !Array.isArray(body.images)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await saveHomeGallery(body.images);

  return NextResponse.json({ ok: true });
}
