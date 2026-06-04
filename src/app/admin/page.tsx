import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-4xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Admin</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-8">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/projects"
            className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">
              Projects
            </p>
            <p className="text-sm text-neutral-800 mb-3">管理 Projects 页面：上传和编辑项目。</p>
            <span className="text-xs tracking-widest uppercase text-neutral-700">
              Enter
            </span>
          </Link>

          <Link
            href="/admin/blog"
            className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">Blog</p>
            <p className="text-sm text-neutral-800 mb-3">管理 Blog 文章列表：写作和编辑推文。</p>
            <span className="text-xs tracking-widest uppercase text-neutral-700">Enter</span>
          </Link>

          <Link
            href="/admin/shop"
            className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">Shop</p>
            <p className="text-sm text-neutral-800 mb-3">
              管理 Shop 商品列表：新增、编辑和下架商品。
            </p>
            <span className="text-xs tracking-widest uppercase text-neutral-700">Enter</span>
          </Link>

          <Link
            href="/admin/about"
            className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">About</p>
            <p className="text-sm text-neutral-800 mb-3">
              管理 About 页面：更改头像和个人简介。
            </p>
            <span className="text-xs tracking-widest uppercase text-neutral-700">Enter</span>
          </Link>

          <Link
            href="/admin/home"
            className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">Home Gallery</p>
            <p className="text-sm text-neutral-800 mb-3">
              管理首页拼贴照片（除中间彩色图以外的所有图片）。
            </p>
            <span className="text-xs tracking-widest uppercase text-neutral-700">Enter</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
