import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReview, type Review } from "@/lib/reviewsStore";

export async function GET(req: NextRequest) {
  return NextResponse.json(await getReviews(req.nextUrl.searchParams.get("category") || undefined));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Review>;
  if (!body.title || !body.cover || !body.detailImage || !body.text) {
    return NextResponse.json({ error: "缺少必填项" }, { status: 400 });
  }
  const review: Review = {
    slug: body.slug || `${Date.now()}`,
    category: body.category || "games",
    title: body.title,
    cover: body.cover,
    detailImage: body.detailImage,
    score: Math.max(0, Math.min(10, Number(body.score) || 0)),
    text: body.text,
  };
  return NextResponse.json(await saveReview(review), { status: 201 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json(await saveReview((await req.json()) as Review));
}
