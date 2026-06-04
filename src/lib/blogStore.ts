import fs from "fs/promises";
import path from "path";
import type { BlogPost } from "./blogData";

const BLOG_PATH = path.join(process.cwd(), "data", "blog.json");

async function readBlogFile(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(BLOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as BlogPost[];
    }
  } catch {
    // ignore and fall back
  }
  return [];
}

async function writeBlogFile(posts: BlogPost[]): Promise<void> {
  await fs.writeFile(BLOG_PATH, JSON.stringify(posts, null, 2), "utf8");
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await readBlogFile();
  return posts;
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await writeBlogFile(posts);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await readBlogFile();
  return posts.find((p) => p.slug === slug);
}
