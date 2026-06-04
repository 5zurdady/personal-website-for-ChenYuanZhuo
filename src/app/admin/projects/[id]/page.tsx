"use client";

import { useRouter, useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Navbar from "@/components/Navbar";

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const imagesFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          setError("加载失败：无法获取项目列表");
          return;
        }
        const list = (await res.json()) as Project[];
        const data = list.find((p) => p.id === id);
        if (!data) {
          setError("加载失败：未找到该项目");
          return;
        }
        setProject(data);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setImages(Array.isArray(data.images) ? data.images : []);
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
      const res = await fetch(`/api/projects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, description, images }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "保存失败");
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
    setImages((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setNewImageInput("");
  };

  const handleRemoveImage = (src: string) => {
    setImages((prev) => prev.filter((v) => v !== src));
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

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("确定要删除这个 Project 吗？此操作不可撤销。")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
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
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">
          Admin / Edit Project
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">
          编辑 Project
        </h1>

        {loading ? (
          <p className="text-sm text-neutral-500">加载中…</p>
        ) : (
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

            <div className="space-y-3">
              <label className="text-xs tracking-widest uppercase text-neutral-600">
                照片列表（文件名）
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
                disabled={saving || deleting}
                className="bg-neutral-900 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50"
              >
                {saving ? "保存中…" : "保存修改"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/projects")}
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
                {deleting ? "删除中…" : "删除 Project"}
              </button>
            </div>
          </form>
        )}
      </main>
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
