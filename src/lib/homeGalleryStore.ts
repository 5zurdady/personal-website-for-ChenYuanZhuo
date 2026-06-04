import fs from "fs/promises";
import path from "path";

export type HomeGalleryData = {
  images: string[];
};

const HOME_GALLERY_PATH = path.join(process.cwd(), "data", "home-gallery.json");

export async function getHomeGallery(): Promise<HomeGalleryData> {
  try {
    const raw = await fs.readFile(HOME_GALLERY_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<HomeGalleryData>;
    if (parsed && Array.isArray(parsed.images)) {
      return { images: parsed.images };
    }
  } catch {
    // ignore and fall back
  }
  return { images: [] };
}

export async function saveHomeGallery(images: string[]): Promise<void> {
  const limited = images.slice(0, 21);
  const payload: HomeGalleryData = { images: limited };
  await fs.writeFile(HOME_GALLERY_PATH, JSON.stringify(payload, null, 2), "utf8");
}
