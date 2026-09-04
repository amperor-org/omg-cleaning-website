"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Scroll provider — Lenis driven off GSAP's ticker.
 *
 * Same contract as the AWA site, and all three lines are load-bearing:
 *   1. `autoRaf: false` + `gsap.ticker.add` — one clock, not two. On its own loop Lenis would
 *      write a scroll position that GSAP's tick then reads a frame late.
 *   2. `lenis.on("scroll", ScrollTrigger.update)` — ScrollTrigger listens for native scroll
 *      events, and Lenis suppresses them.
 *   3. `lagSmoothing(0)` — GSAP otherwise pretends a long frame was short, which shows up as
 *      reveals skipping.
 *
 * Someone who asked for reduced motion did not ask for a page that glides, so they get native
 * scrolling and the reveals below neutralise themselves for the same reason.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();

    // Fonts change metrics after first paint and sections measure before that.
    refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Touch already has the platform's own momentum; intercepting it trades a native feel
      // for a JS approximation of one.
      syncTouch: false,
      autoRaf: false,
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    lenis.on("scroll", ScrollTrigger.update);

    const resize = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", resize);
    refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", resize);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return <>{children}</>;
}
