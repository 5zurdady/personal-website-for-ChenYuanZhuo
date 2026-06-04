"use client";

import { useRouter, useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";

type ShopItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  purchaseLink: string;
};

export default function EditShopItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [item, setItem] = useState<ShopItem | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [saved, setSaved] = useState(false);

  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch("/api/shop");
        if (!res.ok) return;
        const list = (await res.json()) as ShopItem[];
        const data = list.find((p) => p.id === id);
        if (!data) {
          setError("加载失败：未找到该商品");
          return;
        }
        setItem(data);
        setTitle(data.title ?? "");
        setPrice(data.price ?? "");
        setImage(data.image ?? "");
        setPurchaseLink(data.purchaseLink ?? "");
        setDescription(data.description ?? "");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/shop", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: title.trim(),
          price: price.trim(),
          image: image.trim(),
          purchaseLink: purchaseLink.trim(),
          description: description.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "保存失败");
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

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("确定要删除这个商品吗？此操作不可撤销。")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/shop", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "删除失败");
      }
      await res.json();
      setDeleted(true);
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (e: any) {
      setError(e.message || "未知错误");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Admin / Edit Shop Item</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">编辑商品</h1>

        {loading ? (
          <p className="text-sm text-neutral-500">加载中…</p>
        ) : !item ? (
          <p className="text-sm text-red-500">{error || "加载失败"}</p>
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
              <label className="text-xs tracking-widest uppercase text-neutral-600">价格</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
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
                disabled={saving || deleting}
                className="bg-neutral-900 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50"
              >
                {saving ? "保存中…" : "保存修改"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/shop")}
                className="text-xs tracking-widest uppercase text-neutral-600 hover:text-neutral-900"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving || deleting}
                className="text-xs tracking-widest uppercase text-red-600 hover:text-red-700 disabled:opacity-50 ml-auto"
              >
                {deleting ? "删除中…" : "删除商品"}
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
      {deleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white px-6 py-4 shadow-lg text-center">
            <p className="text-sm text-neutral-900 mb-1">删除成功</p>
            <p className="text-xs text-neutral-500">3 秒后自动返回上一页…</p>
          </div>
        </div>
      )}
    </div>
  );
}
