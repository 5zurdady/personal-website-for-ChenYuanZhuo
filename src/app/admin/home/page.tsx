"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AdminHomeGalleryPage() {
  const router = useRouter();
  const MAX_IMAGES = 21;
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/home-gallery");
        if (!res.ok) {
          throw new Error("加载失败");
        }
        const data = (await res.json()) as { images?: string[] };
        setImages(Array.isArray(data.images) ? data.images : []);
      } catch (e: any) {
        setError(e.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAddImage = () => {
    const value = newImageInput.trim();
    if (!value) return;
    setImages((prev) => {
      if (prev.length >= MAX_IMAGES) return prev;
      return prev.includes(value) ? prev : [...prev, value];
    });
    setNewImageInput("");
  };

  const handleRemoveImage = (src: string) => {
    setImages((prev) => prev.filter((item) => item !== src));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const selected = Array.from(files);
    setImages((prev) => {
      const existing = new Set(prev);
      const next = [...prev];

      for (const file of selected) {
        if (next.length >= MAX_IMAGES) break;
        if (!existing.has(file.name)) {
          next.push(file.name);
          existing.add(file.name);
        }
      }

      return next;
    });

    setNewImageInput("");
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/home-gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "保存失败");
      }
      await res.json();
      setSaved(true);
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (e: any) {
      setError(e.message || "未知错误");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Admin / Home Gallery</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">编辑首页拼贴照片</h1>

        <p className="text-[11px] text-neutral-500 mb-4">
          中间彩色的图片（Untitled_Artwork(23).jpg）保持不变，这里只管理其余图片的文件名。
          请先将图片放到项目的 public/images 目录下，然后在下方添加对应的文件名；
          也可以使用右侧的「选择文件」按钮从本地选择已放入该目录的图片文件名。
          最多可以配置 {MAX_IMAGES} 张图片，对应首页除中间外的所有拼贴位置。
        </p>

        {loading ? (
          <p className="text-sm text-neutral-500">加载中…</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-neutral-600">图片文件名列表</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageInput}
                  onChange={(e) => setNewImageInput(e.target.value)}
                  className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                  placeholder="Untitled_Artwork(6).jpg"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="border border-neutral-300 px-3 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
                >
                  添加
                </button>
                <label
                  className="inline-flex items-center justify-center border border-neutral-300 px-4 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100 cursor-pointer min-w-[96px]"
                >
                  选择文件
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {images.length > 0 && (
                <ul className="flex flex-wrap gap-2 text-xs text-neutral-700">
                  {images.map((src, index) => (
                    <li
                      key={`${src}-${index}`}
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

            <p className="text-[11px] text-neutral-500">已添加 {images.length} / {MAX_IMAGES} 张图片</p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-neutral-900 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50"
              >
                {saving ? "保存中…" : "保存修改"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="text-xs tracking-widest uppercase text-neutral-600 hover:text-neutral-900"
              >
                取消
              </button>
            </div>
          </form>
        )}
      </main>
      {saved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white px-6 py-4 shadow-lg text-center">
            <p className="text-sm text-neutral-900 mb-1">保存成功</p>
            <p className="text-xs text-neutral-500">3 秒后自动返回上一页…</p>
          </div>
        </div>
      )}
    </div>
  );
}
