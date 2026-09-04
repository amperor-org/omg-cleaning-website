"use client";

import { useRef } from "react";

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { GENERAL_BOOKING_LINK, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { serviceAreas } from "@/data/services";

import { WhatsAppIcon } from "./WhatsAppIcon";

const HEADLINE = ["A", "spotless", "home,", "booked", "in", "a", "text"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = video.current;
      if (!el) return;

      const cleanups: Array<() => void> = [];

      // Reduced motion: no scrub to perform, so show the cleared frame and the copy outright
      // rather than leaving a visitor on an empty pane.
      if (prefersReducedMotion()) {
        gsap.set(".js-word", { yPercent: 0, autoAlpha: 1 });
        gsap.set(".js-hero-copy", { autoAlpha: 1, y: 0 });
        gsap.set(".js-scroll-hint", { autoAlpha: 0 });
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

        // Seek coalescing. Assigning currentTime on every tick queues seeks faster than the
        // decoder can retire them and the browser drops the backlog, which is what makes a naive
        // scrub freeze then jump. At most one seek is in flight, always re-aimed at the newest
        // position, so the clip tracks the scroll instead of falling behind it.
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

        // Where the squeegee actually is, measured off the clip frame by frame: timeline
        // progress -> horizontal position as a percentage of the viewport. Copy is revealed
        // against this rather than at guessed timings, so a line appears the moment the stroke
        // has passed the place it occupies.
        const WIPER: Array<[number, number]> = [
          [0.12, 3], [0.18, 9], [0.24, 16], [0.27, 22], [0.3, 28], [0.34, 41],
          [0.37, 47], [0.4, 53], [0.43, 59], [0.46, 66], [0.49, 72], [0.52, 78],
          [0.58, 84], [0.61, 91], [0.64, 97],
        ];

        const progressAtX = (xPct: number) => {
          if (!Number.isFinite(xPct) || xPct <= WIPER[0][1]) return WIPER[0][0];
          for (let i = 1; i < WIPER.length; i++) {
            const [p0, x0] = WIPER[i - 1];
            const [p1, x1] = WIPER[i];
            if (xPct <= x1) return p0 + ((p1 - p0) * (xPct - x0)) / (x1 - x0 || 1);
          }
          return WIPER[WIPER.length - 1][0];
        };

        // A beat behind the blade, so text lands on glass that is already clear rather than
        // fighting the stroke for the same pixels.
        const TRAIL = 0.03;

        let tl: gsap.core.Timeline | null = null;

        const build = () => {
          tl?.scrollTrigger?.kill();
          tl?.kill();

          // Width can legitimately be 0 before layout (or in a hidden tab), and dividing by it
          // would collapse every element onto the same cue.
          const vw =
            window.innerWidth || document.documentElement.clientWidth || 1440;

          const revealAt = (node: Element, anchor: number) => {
            const r = node.getBoundingClientRect();
            if (!r.width) return 0.4;
            return Math.min(0.92, progressAtX(((r.left + r.width * anchor) / vw) * 100) + TRAIL);
          };

          const playhead = { t: el.currentTime };

          tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=130%",
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
          ).to(".js-scroll-hint", { autoAlpha: 0, duration: 0.1 }, 0.14);

          // Each word uncovers as the blade clears its own column.
          gsap.utils.toArray<HTMLElement>(".js-word").forEach((word) => {
            tl!.fromTo(
              word,
              { yPercent: 115, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 0.1 },
              revealAt(word, 0.5),
            );
          });

          // Blocks follow once the blade is past their leading edge.
          gsap.utils.toArray<HTMLElement>(".js-hero-copy").forEach((block) => {
            tl!.fromTo(
              block,
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.1 },
              revealAt(block, 0.25),
            );
          });
        };

        build();

        // Cues are derived from measured text positions, and those move: web fonts land after
        // first paint and change the metrics, and a resize re-wraps the headline entirely.
        // Both cases need the cues recomputed or the words uncover in the wrong places.
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
      id="top"
      ref={root}
      className="relative isolate h-screen w-full overflow-hidden bg-porcelain"
    >
      {/* The clip is the whole scene: glass edge to edge, Dubai behind it. */}
      <video
        ref={video}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        poster="/cleaning-poster.jpg"
        aria-hidden="true"
      >
        <source src="/cleaning-scrub.mp4" type="video/mp4" />
      </video>

      {/* Keeps dark type legible over the bright hazy skyline without flattening it. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-porcelain/70 via-porcelain/30 to-transparent" />

      <div className="mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-2xl pt-20">
          <span className="js-hero-copy mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-small font-medium text-emerald-deep backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
            </span>
            Booking now on WhatsApp
          </span>

          <h1 className="text-display-l text-balance md:text-display-xl">
            {HEADLINE.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="mr-[0.28em] inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <span
                  className={`js-word inline-block ${
                    word === "text" ? "text-emerald-deep" : ""
                  }`}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p className="js-hero-copy mt-7 max-w-lg text-body text-slate md:text-lg">
            Message us on WhatsApp and our assistant arranges the service, time,
            cleaner and payment — usually in about a minute. No apps, no call
            centres, no waiting.
          </p>

          <div className="js-hero-copy mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href={GENERAL_BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-emerald px-7 py-4 text-title text-white shadow-lg shadow-emerald/25 transition hover:-translate-y-0.5 hover:bg-emerald-deep hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-deep"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Book on WhatsApp
            </a>
            <span className="text-small text-slate">
              or call{" "}
              <a
                href={`tel:+${WHATSAPP_DISPLAY.replace(/\D/g, "")}`}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </span>
          </div>

          <div className="js-hero-copy mt-11 flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-slate">
            <span className="font-medium text-ink">Serving</span>
            {serviceAreas.map((area, index) => (
              <span key={area} className="flex items-center gap-3">
                {index > 0 && (
                  <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
                )}
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      <span className="js-scroll-hint absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-small text-slate">
        <span className="inline-block h-4 w-[1px] animate-pulse bg-slate/60" />
        Scroll to clean the glass
      </span>
    </section>
  );
}
