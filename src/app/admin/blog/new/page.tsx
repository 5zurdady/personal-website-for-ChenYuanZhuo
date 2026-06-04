"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [cover, setCover] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const imagesFileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("标题和正文是必填的");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const paragraphs = content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          date: date.trim(),
          cover: cover.trim() || undefined,
          excerpt: excerpt.trim() || undefined,
          content: paragraphs,
          images,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "保存失败");
      }
      await res.json();
      router.push("/admin/blog");
    } catch (e: any) {
      setError(e.message || "未知错误");
    } finally {
      setSaving(false);
    }
  };

  const handleCoverFileButtonClick = () => {
    coverFileInputRef.current?.click();
  };

  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCover(file.name);
    event.target.value = "";
  };

  const handleImagesFileButtonClick = () => {
    imagesFileInputRef.current?.click();
  };

  const handleImagesFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setImages((prev) => {
      const next = [...prev];
      for (const file of files) {
        if (!next.includes(file.name)) {
          next.push(file.name);
        }
      }
      return next;
    });
    event.target.value = "";
  };

  const handleAddImage = () => {
    const value = newImageInput.trim();
    if (!value) return;
    setImages((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setNewImageInput("");
  };

  const handleRemoveImage = (src: string) => {
    setImages((prev) => prev.filter((v) => v !== src));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">
          Admin / New Blog Post
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">新建 Blog 文章</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              封面图文件名（例如：Untitled_Artwork(3).jpg）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleCoverFileButtonClick}
                className="border border-neutral-300 px-3 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
              >
                选择文件
              </button>
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileChange}
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              目前先使用已经在 public/images 里的文件名，后面可以再接入真正的图片上传。
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">摘要（可选）</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">正文（用空行分段）</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black min-h-[200px]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              图片列表（文件名）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageInput}
                onChange={(e) => setNewImageInput(e.target.value)}
                className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="border border-neutral-300 px-3 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
              >
                添加
              </button>
              <button
                type="button"
                onClick={handleImagesFileButtonClick}
                className="border border-neutral-300 px-3 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
              >
                选择文件
              </button>
              <input
                ref={imagesFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagesFileChange}
              />
            </div>
            {images.length > 0 && (
              <ul className="flex flex-wrap gap-2 text-xs text-neutral-700">
                {images.map((src) => (
                  <li
                    key={src}
                    className="flex items-center gap-1 border border-neutral-200 px-2 py-1"
                  >
                    <span>{src}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(src)}
                      className="text-neutral-500 hover:text-black"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-[11px] text-red-500">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-neutral-900 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50"
            >
              {saving ? "发布中…" : "发布文章"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="text-xs tracking-widest uppercase text-neutral-600 hover:text-neutral-900"
            >
              取消
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
