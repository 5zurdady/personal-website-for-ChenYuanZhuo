"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

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
  note?: string;
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [cover, setCover] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "both">("image");
  const [video, setVideo] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const imagesFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) return;
        const list = (await res.json()) as BlogPost[];
        const data = list.find((p) => p.slug === slug);
        if (!data) {
          setError("加载失败：未找到该文章");
          return;
        }
        setPost(data);
        setTitle(data.title ?? "");
        setDate(data.date ?? "");
        setCover(data.cover ?? "");
        setExcerpt(data.excerpt ?? "");
        setContent((data.content || []).join("\n\n"));
        setImages(Array.isArray(data.images) ? data.images : []);
        setMediaType(data.mediaType === "video" || data.mediaType === "both" ? data.mediaType : "image");
        setVideo(data.video ?? "");
        setNote(data.note ?? "");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!slug) return;
    setSaving(true);
    setError("");
    try {
      const paragraphs = content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      const payload: any = {
        slug,
        title: title.trim(),
        date: date.trim(),
        cover: cover.trim(),
        excerpt: excerpt.trim(),
        content: paragraphs,
        mediaType,
        note: note.trim(),
      };

      if (mediaType === "image") {
        payload.images = images;
        payload.video = undefined;
      } else if (mediaType === "video") {
        if (!video.trim()) {
          setError("视频文件名不能为空");
          setSaving(false);
          return;
        }
        payload.video = video.trim();
        payload.images = [];
      } else {
        if (!video.trim()) {
          setError("视频文件名不能为空");
          setSaving(false);
          return;
        }
        payload.video = video.trim();
        payload.images = images;
      }

      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "保存失败");
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

  const handleVideoFileButtonClick = () => {
    videoFileInputRef.current?.click();
  };

  const handleVideoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideo(file.name);
    event.target.value = "";
  };

  const handleDelete = async () => {
    if (!slug) return;
    if (!window.confirm("确定要删除这篇 Blog 吗？此操作不可撤销。")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
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
          Admin / Edit Blog Post
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-6">编辑 Blog 文章</h1>

        {loading ? (
          <p className="text-sm text-neutral-500">加载中…</p>
        ) : !post ? (
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
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-neutral-600">摘要</label>
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

            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-neutral-600">备注</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="可选的备注信息"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs tracking-widest uppercase text-neutral-600">
                展示类型
              </label>
              <div className="flex gap-4 text-xs text-neutral-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="h-3 w-3"
                    checked={mediaType === "image"}
                    onChange={() => setMediaType("image")}
                  />
                  <span>照片</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="h-3 w-3"
                    checked={mediaType === "video"}
                    onChange={() => setMediaType("video")}
                  />
                  <span>视频</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="h-3 w-3"
                    checked={mediaType === "both"}
                    onChange={() => setMediaType("both")}
                  />
                  <span>照片 + 视频</span>
                </label>
              </div>
            </div>

            {mediaType !== "video" && (
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
            )}

            {mediaType !== "image" && (
              <div className="space-y-2">
                <label className="text-xs tracking-widest uppercase text-neutral-600">
                  视频文件名（例如：demo.mp4）
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleVideoFileButtonClick}
                    className="border border-neutral-300 px-3 py-2 text-xs tracking-widest uppercase hover:bg-neutral-100"
                  >
                    选择文件
                  </button>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoFileChange}
                  />
                </div>
                <p className="text-[11px] text-neutral-500">
                  同样先使用已经在 public/videos 里的视频文件名，后面可以再接入真正的视频上传。
                </p>
              </div>
            )}

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
                onClick={() => router.push("/admin/blog")}
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
                {deleting ? "删除中…" : "删除文章"}
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
