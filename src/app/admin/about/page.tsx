"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

 type AboutData = {
  title: string;
  description: string;
  image: string;
};

export default function AdminAboutPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/about");
        if (!res.ok) {
          throw new Error("加载失败");
        }
        const data = (await res.json()) as AboutData;
        setTitle(data.title || "");
        setDescription(data.description || "");
        setImage(data.image || "");
      } catch (e: any) {
        setError(e.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          image: image.trim(),
        }),
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
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Admin / About</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">编辑 About 页面</h1>

        {loading ? (
          <p className="text-sm text-neutral-500">加载中…</p>
        ) : (
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
              <label className="text-xs tracking-widest uppercase text-neutral-600">简介</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black min-h-[140px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-neutral-600">
                图片文件名（例如：dce2c47765aa5b0609723227f5b43c29_preview_mid.jpg）
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <p className="text-[11px] text-neutral-500">
                请将图片文件放到 public/images 目录下，这里只填写文件名。
              </p>
            </div>

            {error && <p className="text-[11px] text-red-500">{error}</p>}

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
