import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "仅支持图片文件" }, { status: 400 });
  }

  const extension = path.extname(file.name) || ".png";
  const name = `review-${Date.now()}${extension}`;
  const directory = path.join(process.cwd(), "public", "images");

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(
    path.join(directory, name),
    Buffer.from(await file.arrayBuffer())
  );

  return NextResponse.json({ name });
}
