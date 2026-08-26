"use client";

import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  adminBadge?: boolean;
};

const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blog" },
];

const ABOUT_ITEM = { label: "About", href: "/about" };

const REVIEW_ITEMS = [
  { label: "Games", href: "/reviews/games" },
  { label: "Movies", href: "/reviews/movies" },
  { label: "Books", href: "/reviews/books" },
];

export default function Navbar({ adminBadge = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  return (
    <header className="relative w-full py-6 px-6 md:px-12 flex items-center justify-between">
      <Link
        href="/"
        className="text-sm font-medium tracking-widest uppercase text-neutral-900"
      >
        CHEN YUANZHUO
        {adminBadge && (
          <span className="ml-2 text-[11px] text-neutral-500">（管理员）</span>
        )}
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs tracking-widest uppercase text-neutral-900 hover:opacity-50 transition-opacity duration-300"
          >
            {item.label}
          </Link>
        ))}
        <div className="relative">
          <button
            type="button"
            className="text-xs tracking-widest uppercase text-neutral-900 hover:opacity-50 transition-opacity duration-300"
            onClick={() => setReviewsOpen((prev) => !prev)}
            aria-expanded={reviewsOpen}
            aria-haspopup="menu"
          >
            Reviews
          </button>
          {reviewsOpen && (
            <div className="absolute right-0 top-full mt-3 min-w-36 bg-white border border-neutral-200 shadow-md py-2 z-50">
              {REVIEW_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-xs tracking-widest uppercase text-neutral-900 hover:bg-neutral-100"
                  onClick={() => setReviewsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link
          href={ABOUT_ITEM.href}
          className="text-xs tracking-widest uppercase text-neutral-900 hover:opacity-50 transition-opacity duration-300"
        >
          {ABOUT_ITEM.label}
        </Link>
      </nav>
      {/* Mobile menu placeholder */}
      <button
        type="button"
        className="md:hidden text-xs tracking-widest uppercase text-neutral-900"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        Menu
      </button>
      {isOpen && (
        <nav className="absolute top-full right-6 left-6 mt-3 bg-white border border-neutral-200 shadow-md md:hidden flex flex-col items-stretch py-3 z-50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-xs tracking-widest uppercase text-neutral-900 text-left hover:bg-neutral-100"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="px-4 py-2 text-xs tracking-widest uppercase text-neutral-900 text-left hover:bg-neutral-100"
            onClick={() => setReviewsOpen((prev) => !prev)}
            aria-expanded={reviewsOpen}
          >
            Reviews
          </button>
          {reviewsOpen && (
            <div className="border-t border-neutral-100 py-1">
              {REVIEW_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-8 py-2 text-xs tracking-widest uppercase text-neutral-600 hover:bg-neutral-100"
                  onClick={() => {
                    setReviewsOpen(false);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          <Link
            href={ABOUT_ITEM.href}
            className="px-4 py-2 text-xs tracking-widest uppercase text-neutral-900 text-left hover:bg-neutral-100"
            onClick={() => setIsOpen(false)}
          >
            {ABOUT_ITEM.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
