import { NextRequest, NextResponse } from "next/server";
import { getAbout, saveAbout, AboutData } from "@/lib/aboutStore";

export async function GET() {
  const about = await getAbout();
  return NextResponse.json(about);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Partial<AboutData> | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const current = await getAbout();

  const updated: AboutData = {
    title: (body.title ?? current.title).trim(),
    description: (body.description ?? current.description).trim(),
    image: (body.image ?? current.image).trim(),
  };

  await saveAbout(updated);

  return NextResponse.json(updated);
}
