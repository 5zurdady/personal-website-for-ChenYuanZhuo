"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type CollageItem = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  z?: number;
};

const CENTER_SRC = "Untitled_Artwork(23).jpg";

function resolveSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return `/images/${src}`;
}

// Base desktop collage layout (positions/sizes). 23 号放在视觉中心。
const baseCollage: CollageItem[] = [
  { src: "Untitled_Artwork(6).jpg", left: 10, top: 30, width: 240, height: 350 },
  { src: "Untitled_Artwork(7).jpg", left: 230, top: -20, width: 190, height: 280 },
  { src: "Untitled_Artwork(8).jpg", left: 430, top: 100, width: 240, height: 350 },
  { src: "Untitled_Artwork(9).jpg", left: 670, top: -10, width: 260, height: 380 },
  { src: "Untitled_Artwork(10).jpg", left: 900, top: 140, width: 180, height: 260 },
  { src: "Untitled_Artwork(11).jpg", left: 50, top: 380, width: 260, height: 370 },
  { src: "Untitled_Artwork(12).jpg", left: 320, top: 360, width: 190, height: 280 },
  { src: CENTER_SRC, left: 500, top: 300, width: 320, height: 450, z: 12 }, // center bigger
  { src: "Untitled_Artwork(13).jpg", left: 820, top: 390, width: 230, height: 340 },
  { src: "Untitled_Artwork(14).jpg", left: 1040, top: 430, width: 190, height: 290 },
  { src: "Untitled_Artwork(15).jpg", left: -20, top: 740, width: 230, height: 330 },
  { src: "Untitled_Artwork(16).jpg", left: 210, top: 700, width: 200, height: 290 },
  { src: "Untitled_Artwork(17).jpg", left: 430, top: 710, width: 250, height: 360 },
  { src: "Untitled_Artwork(18).jpg", left: 710, top: 710, width: 270, height: 390 },
  { src: "Untitled_Artwork(19).jpg", left: 980, top: 720, width: 220, height: 320 },
  { src: "Untitled_Artwork(20).jpg", left: 220, top: 260, width: 180, height: 260, z: 7 },
  { src: "Untitled_Artwork(21).jpg", left: 1070, top: 240, width: 200, height: 300, z: 8 },
  { src: "Untitled_Artwork(22).jpg", left: 980, top: -20, width: 190, height: 280, z: 9 },
];

const nonCenterIndices = baseCollage.reduce<number[]>((acc, item, index) => {
  if (item.src === CENTER_SRC) return acc;
  acc.push(index);
  return acc;
}, []);

const MAX_HOME_IMAGES = nonCenterIndices.length;
const defaultNonCenterSources = nonCenterIndices.map((index) => baseCollage[index].src);

export default function ImageGallery() {
  const [images, setImages] = useState<string[]>(defaultNonCenterSources);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/home-gallery-random");
        if (!res.ok) return;
        const data = (await res.json()) as { images?: string[] };
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) return;
        setImages(data.images.slice(0, MAX_HOME_IMAGES));
      } catch {
        // ignore and keep defaults
      }
    };

    load();
  }, []);

  const collage: CollageItem[] = useMemo(() => {
    if (!images.length) return baseCollage;

    return baseCollage.map((item, index) => {
      if (item.src === CENTER_SRC) return item;
      const position = nonCenterIndices.indexOf(index);
      if (position === -1) return item;
      const overrideSrc = images[position];
      if (!overrideSrc) return item;
      return { ...item, src: overrideSrc };
    });
  }, [images]);

  const mobileImages = useMemo(() => collage.map((c) => c.src), [collage]);
  return (
    <section className="w-full px-4 md:px-0 pb-12 md:pb-20">
      {/* Mobile / Tablet fallback: masonry-like grid */}
      <div className="md:hidden grid grid-cols-2 gap-2">
        {mobileImages.map((src) => (
          <div
            key={src}
            className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
          >
            <Image
              src={resolveSrc(src)}
              alt={src}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop collage */}
      <div className="hidden md:block">
        <div className="relative mx-auto max-w-[1240px] min-h-[1300px]">
          {collage.map(({ src, left, top, width, height, z }) => (
            <div
              key={src}
              className="absolute overflow-hidden bg-neutral-100 shadow-sm"
              style={{
                left,
                top,
                width,
                height,
                zIndex: z ?? 1,
              }}
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out hover:scale-[1.04]">
                <Image
                  src={resolveSrc(src)}
                  alt={src}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 30vw, 400px"
                  priority={src === CENTER_SRC}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
