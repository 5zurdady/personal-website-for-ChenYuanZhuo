"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const imagesFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !cover.trim()) {
      setError("标题、简介和封面图是必填的");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          cover: cover.trim(),
          images,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "保存失败");
      }
      await res.json();
      router.push("/admin/projects");
    } catch (e: any) {
      setError(e.message || "未知错误");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = () => {
    const value = newImageInput.trim();
    if (!value) return;
    if (!images.includes(value)) {
      setImages([...images, value]);
    }
    setNewImageInput("");
  };

  const handleRemoveImage = (src: string) => {
    setImages(images.filter((v) => v !== src));
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">
          Admin / New Project
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">
          发布 Project
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              简介
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              封面图文件名（例如：Untitled_Artwork(2).jpg）
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

          <div className="space-y-3">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              照片列表（同样填文件名）
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
                  <li key={src} className="flex items-center gap-1 border border-neutral-200 px-2 py-1">
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
              {saving ? "发布中…" : "发布 Project"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/projects")}
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
