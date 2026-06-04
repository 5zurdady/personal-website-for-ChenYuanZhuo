"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NewShopItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !price.trim() || !image.trim() || !purchaseLink.trim()) {
      setError("标题、价格、图片文件名和购买链接是必填的");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          price: price.trim(),
          image: image.trim(),
          purchaseLink: purchaseLink.trim(),
          description: description.trim(),
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

  const handleImageFileButtonClick = () => {
    imageFileInputRef.current?.click();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file.name);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Admin / New Shop Item</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">新建商品</h1>
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
            <label className="text-xs tracking-widest uppercase text-neutral-600">价格</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="$120"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">
              图片文件名（例如：Untitled_Artwork(3).jpg）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleImageFileButtonClick}
                className="border border-neutral-300 px-3 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
              >
                选择文件
              </button>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">购买链接</label>
            <input
              type="url"
              value={purchaseLink}
              onChange={(e) => setPurchaseLink(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="https://…"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-neutral-600">简介（可选）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black min-h-[120px]"
            />
          </div>

          {error && <p className="text-[11px] text-red-500">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-neutral-900 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50"
            >
              {saving ? "发布中…" : "发布商品"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/shop")}
              className="text-xs tracking-widest uppercase text-neutral-600 hover:text-neutral-900"
            >
              取消
            </button>
          </div>
        </form>
      </main>
      {saved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white px-6 py-4 shadow-lg text-center">
            <p className="text-sm text-neutral-900 mb-1">发布成功</p>
            <p className="text-xs text-neutral-500">3 秒后自动返回上一页…</p>
          </div>
        </div>
      )}
    </div>
  );
}
