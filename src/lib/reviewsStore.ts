import fs from "fs/promises";
import path from "path";

export type Review = {
  slug: string;
  category: "games" | "movies" | "books";
  title: string;
  cover: string;
  detailImage: string;
  score: number;
  text: string;
};

const FILE = path.join(process.cwd(), "data", "reviews.json");

async function readReviews(): Promise<Review[]> {
  try {
    const value = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

async function writeReviews(items: Review[]) {
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function getReviews(category?: string) {
  const items = await readReviews();
  return category ? items.filter((item) => item.category === category) : items;
}

export async function getReview(slug: string) {
  return (await readReviews()).find((item) => item.slug === slug);
}

export async function saveReview(input: Review) {
  const items = await readReviews();
  const index = items.findIndex((item) => item.slug === input.slug);
  if (index >= 0) items[index] = input;
  else items.unshift(input);
  await writeReviews(items);
  return input;
}
