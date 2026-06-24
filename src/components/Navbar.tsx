"use client";

import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  adminBadge?: boolean;
};

const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function Navbar({ adminBadge = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
        </nav>
      )}
    </header>
  );
}
