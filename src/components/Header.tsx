'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Tv, Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bgdark border-b-2 border-black">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary border-2 border-black rounded-brut p-1.5 shadow-brut-sm">
            <Tv size={20} strokeWidth={2.5} />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight">
            SAYEM TV
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/category/sports">Sports</NavLink>
          <NavLink href="/category/bangladesh">Bangladesh</NavLink>
          <NavLink href="/search">Search</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="btn-brut bg-primary p-2 rounded-brut"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={2.5} />
          </Link>
          <button
            className="md:hidden btn-brut bg-primary p-2 rounded-brut"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-2 px-4 pb-4">
          <NavLink href="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink href="/category/sports" onClick={() => setMenuOpen(false)}>Sports</NavLink>
          <NavLink href="/category/bangladesh" onClick={() => setMenuOpen(false)}>Bangladesh</NavLink>
          <NavLink href="/search" onClick={() => setMenuOpen(false)}>Search</NavLink>
        </nav>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 font-heading font-bold rounded-brut border-2 border-transparent hover:border-black hover:bg-primary hover:shadow-brut-sm transition-all"
    >
      {children}
    </Link>
  );
}
