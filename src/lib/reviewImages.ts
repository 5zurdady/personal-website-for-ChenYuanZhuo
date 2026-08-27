import type { Review } from "@/lib/reviewsStore";

export function reviewImagePath(review: Pick<Review, "category">, file: string) {
  const cleanFile = file.replace(/^\/+/, "");
  return `/images/reviews/${review.category}/${cleanFile}`;
}
