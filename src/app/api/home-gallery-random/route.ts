import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CENTER_SRC = "Untitled_Artwork(23).jpg";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function shuffle<T>(input: T[]): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const entries = await fs.readdir(imagesDir, { withFileTypes: true });

    const allImages = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => {
        if (name === CENTER_SRC) return false;
        const ext = path.extname(name).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
      });

    const shuffled = shuffle(allImages);

    return NextResponse.json({ images: shuffled });
  } catch {
    // 出错时返回空列表，前端会使用默认拼贴配置
    return NextResponse.json({ images: [] });
  }
}
