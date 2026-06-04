"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

type GalleryItem = { src: string };

type ProjectData = {
  id: string;
  title: string;
  description: string;
  cover: string;
  images: string[];
};

const defaultGallery: GalleryItem[] = Array.from({ length: 21 }, (_, idx) => idx + 3).map(
  (n) => ({
    src: `Untitled_Artwork(${n}).jpg`,
  }),
);

const defaultProject: ProjectData = {
  id: "static-project-one",
  title: "Project One Title",
  description:
    "Placeholder description for Project One. Add your story, context, and credits here. Replace this text with real project copy to match the reference layout.",
  cover: "Untitled_Artwork(2).jpg",
  images: defaultGallery.map((g) => g.src),
};

export default function ProjectOnePage() {
  const [project, setProject] = useState<ProjectData>(defaultProject);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const currentImage =
    activeIndex !== null && activeIndex >= 0 && activeIndex < gallery.length
      ? gallery[activeIndex]
      : null;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const list = (await res.json()) as ProjectData[];
        if (!Array.isArray(list) || list.length === 0) return;

        let id: string | null = null;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          id = params.get("id");
        }

        const target = id ? list.find((item) => item.id === id) : undefined;
        const base = target ?? list[list.length - 1];

        const merged: ProjectData = {
          ...defaultProject,
          ...base,
          images: Array.isArray(base.images) && base.images.length ? base.images : defaultProject.images,
        };
        setProject(merged);
        setGallery(
          (Array.isArray(merged.images) && merged.images.length
            ? merged.images
            : defaultProject.images
          ).map((src) => ({ src })),
        );
      } catch {
        // ignore fetch errors and keep defaults
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current + 1) % gallery.length;
        });
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current + gallery.length - 1) % gallery.length;
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, gallery.length]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-10 md:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-24 md:gap-40 items-start mb-10 md:mb-12 max-w-7xl mx-auto w-full">
          <div className="relative h-80 md:h-96 overflow-hidden">
            <Image
              src={`/images/${project.cover}`}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          <div className="flex flex-col gap-3 text-neutral-800">
            <p className="text-xs tracking-widest uppercase text-neutral-500">Project One</p>
            <h1 className="text-3xl md:text-4xl font-semibold">{project.title}</h1>
            <p className="text-sm md:text-base leading-7 text-neutral-600">{project.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-6">
          {gallery.map(({ src }, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden flex justify-center h-64 md:h-72 flex-[0_0_auto] cursor-zoom-in"
            >
              <Image
                src={`/images/${src}`}
                alt={src}
                width={1654}
                height={2339}
                className="h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>

        {currentImage && (
          <div
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 text-xl md:text-2xl text-neutral-700 hover:text-black"
              onClick={() => setActiveIndex(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            <button
              type="button"
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-neutral-700 hover:text-black"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((current) => {
                  if (current === null) return current;
                  return (current + gallery.length - 1) % gallery.length;
                });
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-neutral-700 hover:text-black"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((current) => {
                  if (current === null) return current;
                  return (current + 1) % gallery.length;
                });
              }}
              aria-label="Next image"
            >
              ›
            </button>
            <div
              className="relative max-w-5xl w-full max-h-[80vh]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] md:h-[70vh]">
                <Image
                  src={`/images/${currentImage.src}`}
                  alt={currentImage.src}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
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
