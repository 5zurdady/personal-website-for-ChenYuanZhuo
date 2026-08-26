import Link from "next/link";
import Navbar from "@/components/Navbar";

const CATEGORY_LABELS: Record<string, string> = {
  games: "Games",
  movies: "Movies",
  books: "Books",
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({ category }));
}

export default async function AdminReviewCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] ?? "Reviews";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar adminBadge />
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full max-w-4xl mx-auto">
        <Link
          href="/admin/reviews"
          className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900"
        >
          Admin / Reviews
        </Link>
        <h1 className="mt-6 text-2xl md:text-3xl font-semibold text-neutral-900">{label}</h1>
        <p className="mt-4 text-sm text-neutral-500">暂无内容</p>
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
