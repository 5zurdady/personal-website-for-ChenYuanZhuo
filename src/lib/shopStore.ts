import fs from "fs/promises";
import path from "path";

export type ShopItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  purchaseLink: string;
  createdAt: string;
  updatedAt: string;
};

const SHOP_PATH = path.join(process.cwd(), "data", "shop.json");

async function readShopFile(): Promise<ShopItem[]> {
  try {
    const raw = await fs.readFile(SHOP_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as ShopItem[];
    }
  } catch {
    // ignore and fall back
  }
  return [];
}

async function writeShopFile(items: ShopItem[]): Promise<void> {
  await fs.writeFile(SHOP_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function getShopItems(): Promise<ShopItem[]> {
  return readShopFile();
}

export async function saveShopItems(items: ShopItem[]): Promise<void> {
  await writeShopFile(items);
}

export async function getShopItemById(id: string): Promise<ShopItem | undefined> {
  const items = await readShopFile();
  return items.find((item) => item.id === id);
}
