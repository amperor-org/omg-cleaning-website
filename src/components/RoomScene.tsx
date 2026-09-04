"use client";

import { useRef } from "react";

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const HEADLINE = ["Every", "corner,", "every", "time"];

const POINTS = [
  "Background-checked, trained cleaners",
  "Professional equipment and supplies included",
  "Same cleaner on repeat visits where you want one",
];

export function RoomScene() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = video.current;
      if (!el) return;

      const cleanups: Array<() => void> = [];

      if (prefersReducedMotion()) {
        gsap.set(".js-room-word", { yPercent: 0, autoAlpha: 1 });
        gsap.set(".js-room-copy", { autoAlpha: 1, y: 0 });
        const settle = () => {
          el.currentTime = el.duration || 0;
        };
        if (el.readyState >= 1) settle();
        else el.addEventListener("loadedmetadata", settle, { once: true });
        return;
      }

      const start = () => {
        const duration = el.duration;
        if (!duration || Number.isNaN(duration)) return;

        // Same coalescing as the hero: one seek in flight at a time, always re-aimed at the
        // newest scroll position, so the clip tracks the scroll instead of queueing behind it.
        let target = 0;
        let inFlight = false;

        const pump = () => {
          if (Math.abs(el.currentTime - target) < 0.034) {
            inFlight = false;
            return;
          }
          inFlight = true;
          el.currentTime = target;
        };

        el.addEventListener("seeked", () => {
          if (Math.abs(el.currentTime - target) >= 0.034) pump();
          else inFlight = false;
        });

        // Measured off this clip frame by frame: timeline progress -> the cleaner's horizontal
        // position as a percentage of the frame. He travels right to left, so the list runs
        // downward and copy on the right is uncovered first — the mirror of the hero's wipe.
        const MAN: Array<[number, number]> = [
          [0.04, 91], [0.14, 78], [0.17, 66], [0.23, 59], [0.3, 53], [0.33, 47],
          [0.46, 41], [0.63, 34], [0.73, 28], [0.76, 22], [0.82, 16], [0.86, 9],
          [0.89, 3],
        ];

        const progressAtX = (xPct: number) => {
          if (!Number.isFinite(xPct)) return 0.4;
          if (xPct >= MAN[0][1]) return MAN[0][0];
          for (let i = 1; i < MAN.length; i++) {
            const [p0, x0] = MAN[i - 1];
            const [p1, x1] = MAN[i];
            if (xPct >= x1) return p0 + ((p1 - p0) * (x0 - xPct)) / (x0 - x1 || 1);
          }
          return MAN[MAN.length - 1][0];
        };

        const TRAIL = 0.04;
        let tl: gsap.core.Timeline | null = null;

        const build = () => {
          tl?.scrollTrigger?.kill();
          tl?.kill();

          const vw =
            window.innerWidth || document.documentElement.clientWidth || 1440;

          const revealAt = (node: Element, anchor: number) => {
            const r = node.getBoundingClientRect();
            if (!r.width) return 0.45;
            return Math.min(
              0.94,
              progressAtX(((r.left + r.width * anchor) / vw) * 100) + TRAIL,
            );
          };

          const playhead = { t: el.currentTime };

          tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=140%",
              pin: true,
              scrub: 0.4,
              anticipatePin: 1,
            },
          });

          tl.to(
            playhead,
            {
              t: duration,
              ease: "none",
              duration: 1,
              onUpdate: () => {
                target = playhead.t;
                if (!inFlight) pump();
              },
            },
            0,
          );

          // Anchored at the right edge of each element: he sweeps leftwards, so he passes a
          // block's right side first.
          gsap.utils.toArray<HTMLElement>(".js-room-word").forEach((word) => {
            tl!.fromTo(
              word,
              { yPercent: 115, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 0.1 },
              revealAt(word, 0.5),
            );
          });

          gsap.utils.toArray<HTMLElement>(".js-room-copy").forEach((block) => {
            tl!.fromTo(
              block,
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.1 },
              revealAt(block, 0.75),
            );
          });
        };

        build();
        document.fonts?.ready.then(build);

        let resizeTimer: number | undefined;
        const onResize = () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(build, 200);
        };
        window.addEventListener("resize", onResize);
        cleanups.push(() => {
          window.clearTimeout(resizeTimer);
          window.removeEventListener("resize", onResize);
        });
      };

      el.pause();
      if (el.readyState >= 1) start();
      else el.addEventListener("loadedmetadata", start, { once: true });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root },
  );

  return (
    <section
      id="how-it-works"
      ref={root}
      className="relative isolate h-screen w-full overflow-hidden bg-porcelain"
    >
      <video
        ref={video}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        poster="/vacuum-poster.jpg"
        aria-hidden="true"
      >
        <source src="/vacuum-scrub.mp4" type="video/mp4" />
      </video>

      {/* Mirrors the hero's scrim, weighted to the right where this section's copy sits. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-porcelain/85 via-porcelain/40 to-transparent" />

      <div className="mx-auto flex h-full max-w-7xl items-center justify-end px-6">
        <div className="max-w-lg text-right">
          <span className="js-room-copy mb-5 inline-block text-small font-semibold uppercase tracking-[0.14em] text-emerald-deep">
            The clean itself
          </span>

          <h2 className="text-display-m text-balance md:text-display-l">
            {HEADLINE.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="ml-[0.28em] inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <span className="js-room-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="js-room-copy mt-6 text-body text-slate md:text-lg">
            A booking is only as good as the clean behind it. Ours are done by
            people we have trained and checked, with everything they need
            brought to your door.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li
                key={point}
                className="js-room-copy flex items-center justify-end gap-3 text-small text-slate"
              >
                {point}
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald"
                  aria-hidden
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
