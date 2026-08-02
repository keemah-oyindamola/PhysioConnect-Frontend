"use client";

import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/common/Logo";
import Link from "next/link";

const navLinks = [
  { id: "roles", label: "Who it's for" },
  { id: "how", label: "How it works" },
  { id: "trust", label: "Security" },
];

export function Navbar() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-paper/85 border-b border-ink/8">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Wordmark />
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-ink/70">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className="hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-[13.5px] font-medium text-ink/70 hover:text-ink">
            Sign in
          </Link>
          <Link href="/register" className="bg-teal text-white text-[13.5px] font-medium px-4 py-2.5 rounded-full hover:bg-[#195a4a] transition-colors shadow-[0_8px_20px_-8px_rgba(31,111,92,0.6)] flex items-center gap-1.5">
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}