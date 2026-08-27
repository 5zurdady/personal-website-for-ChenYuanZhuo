import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getReviews } from "@/lib/reviewsStore";
import ScoreGuide from "@/components/ScoreGuide";
import { reviewImagePath } from "@/lib/reviewImages";

const CATEGORY_LABELS: Record<string, string> = { games: "Games", movies: "Movies", books: "Books" };

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({ category }));
}

export default async function ReviewCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] ?? "Reviews";
  const reviews = await getReviews(category);
  const sortedReviews = [...reviews].sort(
    (first, second) => second.score - first.score || first.title.localeCompare(second.title, "zh-CN")
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-5xl w-full self-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500">Reviews</p>
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
          <h1 className="shrink-0 text-2xl font-semibold text-neutral-900 md:text-3xl">{label.toUpperCase()}</h1>
          <ScoreGuide />
        </div>
        <div className="mt-10 space-y-16">
            {sortedReviews.map((review) => (
              <Link key={review.slug} href={`/reviews/${category}/${review.slug}`} className="group grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 md:gap-12 items-start">
                <div className="relative w-full overflow-hidden bg-neutral-100">
                  <Image src={reviewImagePath(review, review.cover)} alt={review.title} width={1200} height={675} className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 40vw" />
                  <span className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-semibold text-neutral-900 shadow-sm">{review.score}</span>
                </div>
                <div className="pt-1 md:pt-3">
                  <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-neutral-900 group-hover:opacity-60 transition-opacity">{review.title}</h2>
                  <p className="mt-4 text-xs tracking-widest uppercase text-neutral-500">Read review</p>
                </div>
              </Link>
            ))}
        </div>
      </main>
      <footer className="w-full py-8 px-6 md:px-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400">&copy;2026 ChenYuanzhuo</p>
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">蜀ICP备2026031249号</p>
      </footer>
    </div>
  );
}
