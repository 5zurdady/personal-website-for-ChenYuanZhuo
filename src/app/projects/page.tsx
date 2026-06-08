import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getProjects } from "@/lib/projectsStore";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-4 md:px-12 py-12 md:py-16 w-full self-center max-w-6xl">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-6">Projects</p>
        {projects.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Under development, we'll meet again soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/one?id=${p.id}`}
                className="relative w-full overflow-hidden group block"
              >
                <div className="relative aspect-[4/3] bg-neutral-100">
                  <Image
                    src={`/images/${p.cover}`}
                    alt="Project image"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/35 transition-colors duration-300">
                    {p.title && (
                      <p className="px-4 text-lg md:text-2xl lg:text-3xl tracking-[0.3em] font-semibold text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {p.title}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
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
