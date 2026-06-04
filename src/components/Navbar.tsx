import Link from "next/link";

type NavbarProps = {
  adminBadge?: boolean;
};

export default function Navbar({ adminBadge = false }: NavbarProps) {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between">
      <Link
        href="/"
        className="text-sm font-medium tracking-widest uppercase text-neutral-900"
      >
        ChenYuanzhuo{adminBadge && <span className="ml-2 text-[11px] text-neutral-500">（管理员）</span>}
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        {["Projects", "Blog", "Shop", "About"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-xs tracking-widest uppercase text-neutral-900 hover:opacity-50 transition-opacity duration-300"
          >
            {item}
          </Link>
        ))}
      </nav>
      {/* Mobile menu placeholder */}
      <button className="md:hidden text-xs tracking-widest uppercase text-neutral-900">
        Menu
      </button>
    </header>
  );
}
