import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getReview, getReviews } from "@/lib/reviewsStore";

export async function generateStaticParams() {
  return (await getReviews("games")).map(({ slug }) => ({ slug }));
}

export default async function GameReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return null;
  return <div className="min-h-screen flex flex-col bg-white"><Navbar /><main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-5xl w-full self-center"><Link href="/reviews/games" className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900">Games</Link><article className="mt-6 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-12 items-start"><div className="relative w-full overflow-hidden bg-neutral-100"><Image src={`/images/${review.detailImage}`} alt={review.title} width={900} height={1260} className="block w-full h-auto" sizes="(max-width: 768px) 100vw, 40vw" priority /></div><div className="text-neutral-700"><h1 className="text-xl md:text-2xl font-semibold tracking-wide text-neutral-900">{review.title}</h1><p className="mt-3 text-sm text-neutral-500">评分 {review.score} / 10</p><div className="mt-6 whitespace-pre-line text-sm md:text-base leading-8">{review.text}</div></div></article></main><footer className="w-full py-8 px-6 md:px-12 text-center"><p className="text-[10px] tracking-widest uppercase text-neutral-400">&copy;2026 ChenYuanzhuo</p><p className="text-[10px] tracking-widest uppercase text-neutral-400 mt-1">蜀ICP备2026031249号</p></footer></div>;
}
