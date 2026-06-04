import fs from "fs/promises";
import path from "path";

export type AboutData = {
  title: string;
  description: string;
  image: string;
};

const ABOUT_PATH = path.join(process.cwd(), "data", "about.json");

const DEFAULT_ABOUT: AboutData = {
  title: "About ChenYuanzhuo",
  description: "",
  image: "dce2c47765aa5b0609723227f5b43c29_preview_mid.jpg",
};

export async function getAbout(): Promise<AboutData> {
  try {
    const raw = await fs.readFile(ABOUT_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AboutData>;
    return {
      title: parsed.title ?? DEFAULT_ABOUT.title,
      description: parsed.description ?? DEFAULT_ABOUT.description,
      image: parsed.image ?? DEFAULT_ABOUT.image,
    };
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function saveAbout(data: AboutData): Promise<void> {
  await fs.writeFile(ABOUT_PATH, JSON.stringify(data, null, 2), "utf8");
}
