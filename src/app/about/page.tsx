import Navbar from "@/components/Navbar";
import Image from "next/image";
import { getAbout } from "@/lib/aboutStore";

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-5xl w-full self-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-6">About</p>

        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-12 items-start">
          <div className="relative w-full max-w-md aspect-[4/5] bg-neutral-100 overflow-hidden">
            <Image
              src={`/images/${about.image}`}
              alt={about.title || "Portrait"}
              fill
              className="object-cover"
            />
          </div>

          <div className="text-sm md:text-base text-neutral-600 leading-7 space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">{about.title}</h1>
            <p>{about.description}</p>
          </div>
        </section>
      </main>
      <footer className="w-full py-8 px-6 md:px-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400">
          &copy;2026 ChenYuanzhuo
        </p>
      </footer>
    </div>
  );
}
