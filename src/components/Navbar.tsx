"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { GENERAL_BOOKING_LINK } from "@/lib/whatsapp";

import { WhatsAppIcon } from "./WhatsAppIcon";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Areas", href: "#areas" },
];

export function Navbar() {
  // Transparent over the hero glass, then a solid bar once the visitor scrolls past it.
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setSolid(window.scrollY > 40);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-line/80 bg-porcelain/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/omg-icon.png"
            alt=""
            width={178}
            height={179}
            priority
            className="h-9 w-9 rounded-lg shadow-sm"
          />
          <span className="font-display text-body font-bold tracking-tight text-ink">
            OMG <span className="font-semibold text-slate">Cleaning</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-small font-medium text-slate transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GENERAL_BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-small font-semibold text-white shadow-md shadow-emerald/20 transition hover:-translate-y-0.5 hover:bg-emerald-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-deep"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Book on WhatsApp</span>
            <span className="sm:hidden">Book</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 text-ink md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d={open ? "M4 4l10 10M14 4L4 14" : "M2 5h14M2 9h14M2 13h14"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-porcelain/95 px-6 py-4 backdrop-blur-md md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-body font-medium text-slate hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
