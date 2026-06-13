"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  excerpt: string;
  content: string[];
  images?: string[];
  mediaType?: "image" | "video" | "both";
  video?: string;
};

export default function BlogPostPage() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop() || "";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) return;
        const list = (await res.json()) as BlogPost[];
        const index = list.findIndex((p) => p.slug === slug);
        if (index === -1) {
          setPost(null);
        } else {
          const found = list[index];
          setPost(found);
          setPrevPost(index > 0 ? list[index - 1] : null);
          setNextPost(index < list.length - 1 ? list[index + 1] : null);
        }
      } catch (e: any) {
        setError(e.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (activeIndex === null || !post || !post.images || post.images.length === 0) return;

    const handleKey = (event: KeyboardEvent) => {
      if (!post.images || post.images.length === 0) return;
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current + 1) % post.images!.length;
        });
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current + post.images!.length - 1) % post.images!.length;
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, post]);

  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-3xl w-full self-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-3">Blog</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4">文章不存在</h1>
          <p className="text-sm text-neutral-600 mb-2">链接缺少 slug 参数。</p>
        </main>
        <footer className="w-full py-8 px-6 md:px-12 text-center">
          <p className="text-[10px] tracking-widest uppercase text-neutral-400">
            &copy;2026 ChenYuanzhuo
          </p>
          <p className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">
            蜀ICP备2026031249号
          </p>
        </footer>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-3xl w-full self-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-3">Blog</p>
          <p className="text-sm text-neutral-600">加载中…</p>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-3xl w-full self-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-3">Blog</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4">文章不存在</h1>
          <p className="text-sm text-neutral-600 mb-2">当前 slug 没有对应文章：{slug}</p>
          {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
        </main>
        <footer className="w-full py-8 px-6 md:px-12 text-center">
          <p className="text-[10px] tracking-widest uppercase text-neutral-400">
            &copy;2026 ChenYuanzhuo
          </p>
          <p className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">
            蜀ICP备2026031249号
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-3xl w-full self-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-3">Blog</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold italic text-neutral-900 mb-4">
          {post.title}
        </h1>
        <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-6">{post.date}</p>

        <div className="relative w-full aspect-[4/3] max-w-2xl mb-8 overflow-hidden">
          <Image
            src={`/images/${post.cover}`}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <article className="space-y-5 text-sm md:text-base leading-7 text-neutral-800">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        {(post.mediaType === "video" || post.mediaType === "both") && post.video && (
          <section className="mt-10">
            <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-3">
              Video
            </p>
            <div className="relative w-full max-w-2xl aspect-video bg-black">
              <video
                src={`/videos/${post.video}`}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </section>
        )}

        {(post.mediaType === "image" || post.mediaType === "both" || !post.mediaType) &&
          Array.isArray(post.images) &&
          post.images.length > 0 && (
            <section className="mt-10">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {post.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="group relative flex-shrink-0 w-60 md:w-72 aspect-[4/3] overflow-hidden border border-neutral-200 cursor-zoom-in"
                  >
                    <Image
                      src={`/images/${src}`}
                      alt={src}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

        {(prevPost || nextPost) && (
          <section className="mt-12 flex items-center justify-between">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex items-center gap-2 text-xs md:text-sm text-neutral-700 hover:text-neutral-900"
              >
                <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">
                  ‹
                </span>
                <span className="max-w-xs truncate">
                  上一篇 {prevPost.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group ml-auto flex items-center gap-2 text-xs md:text-sm text-neutral-700 hover:text-neutral-900"
              >
                <span className="max-w-xs truncate text-right">
                  下一篇 {nextPost.title}
                </span>
                <span className="text-lg leading-none group-hover:translate-x-0.5 transition-transform">
                  ›
                </span>
              </Link>
            )}
          </section>
        )}
      </main>
      {Array.isArray(post.images) && post.images.length > 0 && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-xl md:text-2xl text-neutral-700 hover:text-black"
            onClick={() => setActiveIndex(null)}
            aria-label="Close preview"
          >
            ×
          </button>
          {post.images.length > 1 && (
            <>
              <button
                type="button"
                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-neutral-700 hover:text-black"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) => {
                    if (current === null) return current;
                    return (current + post.images!.length - 1) % post.images!.length;
                  });
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-neutral-700 hover:text-black"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) => {
                    if (current === null) return current;
                    return (current + 1) % post.images!.length;
                  });
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
          <div
            className="relative max-w-5xl w-full max-h-[80vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] md:h-[70vh]">
              <Image
                src={`/images/${post.images[activeIndex]}`}
                alt={post.images[activeIndex] || ""}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
      <footer className="w-full py-8 px-6 md:px-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400">
          &copy;2026 ChenYuanzhuo
        </p>
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">
          蜀ICP备2026031249号
        </p>
      </footer>
    </div>
  );
}
