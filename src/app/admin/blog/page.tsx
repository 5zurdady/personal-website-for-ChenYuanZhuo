"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type BlogSummary = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) return;
      const data = (await res.json()) as BlogSummary[];
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">Admin</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">Blog</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="/admin/blog/new"
              className="border border-neutral-900 px-4 py-2 text-xs tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-colors"
            >
              New Post
            </a>
            <button
              type="button"
              onClick={load}
              className="border border-neutral-300 px-4 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-200 p-5">
            <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Write</h2>
            <p className="text-sm text-neutral-600 mb-4">
              Click "New Post" to write a new article, choose a cover from the image library,
              and set the date and excerpt.
            </p>
            <a
              href="/admin/blog/new"
              className="inline-block bg-neutral-900 text-white px-4 py-2 text-xs tracking-widest uppercase hover:bg-black"
            >
              Go to New Post Page
            </a>
          </div>

          <div className="border border-neutral-200 p-5">
            <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Manage</h2>
            {loading ? (
              <p className="text-sm text-neutral-500">Loading…</p>
            ) : posts.length === 0 ? (
              <p className="text-sm text-neutral-500">No posts yet.</p>
            ) : (
              <ul className="divide-y divide-neutral-200 text-sm">
                {posts.map((p) => (
                  <li key={p.slug} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-neutral-900">{p.title}</p>
                      <p className="text-xs text-neutral-500 truncate max-w-[260px]">{p.excerpt}</p>
                    </div>
                    <a
                      href={`/admin/blog/${p.slug}`}
                      className="text-xs tracking-widest uppercase text-neutral-700 hover:text-black"
                    >
                      Edit
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
