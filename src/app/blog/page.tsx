import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blogStore";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-5xl w-full self-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-6">Blog</p>

        {blogPosts.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Under development, we'll meet again soon.
          </p>
        ) : (
          <div className="space-y-16">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 md:gap-12 items-center"
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative w-full max-w-md aspect-[4/3] overflow-hidden cursor-pointer">
                    <Image
                      src={`/images/${post.cover}`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>

                <div className="text-center md:text-left">
                  <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-500 mb-2">
                    {post.date}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="inline-block">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold italic text-neutral-900 hover:opacity-70 transition-opacity">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="mt-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs tracking-widest uppercase underline underline-offset-4 text-neutral-700 hover:opacity-70"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <footer className="w-full py-8 px-6 md:px-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400">
          &copy;2026 ChenYuanzhuo
        </p>
      </footer>
    </div>
  );
}
