import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, saveBlogPosts } from "@/lib/blogStore";
import type { BlogPost } from "@/lib/blogData";
import { randomUUID } from "crypto";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<BlogPost> & {
    title?: string;
    content?: string[];
  };

  if (!body.title || !body.content || body.content.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const posts = await getBlogPosts();

  let slug = body.slug;
  if (!slug) {
    const base = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    slug = base || randomUUID().slice(0, 8);
  }

  let uniqueSlug = slug;
  let counter = 2;
  while (posts.some((p) => p.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  const now = new Date();
  const isoDate = body.date || now.toISOString().slice(0, 10);

  const post: BlogPost = {
    slug: uniqueSlug,
    title: body.title,
    date: isoDate,
    cover: body.cover || "Untitled_Artwork(3).jpg",
    excerpt:
      body.excerpt ||
      (body.content[0].length > 140 ? `${body.content[0].slice(0, 140)}…` : body.content[0]),
    content: body.content,
    images: Array.isArray(body.images) ? body.images : [],
  };

  posts.unshift(post);
  await saveBlogPosts(posts);

  return NextResponse.json(post, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Partial<BlogPost> & { slug?: string };

  if (!body.slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const posts = await getBlogPosts();
  const index = posts.findIndex((p) => p.slug === body.slug);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = posts[index];
  const updated: BlogPost = {
    ...current,
    ...body,
    slug: current.slug,
  };

  posts[index] = updated;
  await saveBlogPosts(posts);

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { slug?: string } | null;
  const slug = body?.slug;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const posts = await getBlogPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  posts.splice(index, 1);
  await saveBlogPosts(posts);

  return NextResponse.json({ ok: true });
}
