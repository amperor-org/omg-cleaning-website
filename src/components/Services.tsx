"use client";

import { useRef } from "react";

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { services } from "@/data/services";
import { bookServiceLink } from "@/lib/whatsapp";

import { WhatsAppIcon } from "./WhatsAppIcon";

export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Reduced motion: leave everything at its natural position. The elements are authored
      // visible, so this is simply "do nothing" rather than a second code path to maintain.
      if (prefersReducedMotion()) return;

      gsap.from(".js-services-intro", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      gsap.from(".js-service-card", {
        opacity: 0,
        y: 26,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".js-services-grid", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="services"
      ref={root}
      className="bg-mist py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="js-services-intro max-w-2xl">
          <span className="text-small font-semibold uppercase tracking-[0.14em] text-emerald-deep">
            Our services
          </span>
          <h2 className="mt-4 text-display-m md:text-display-l">
            Pick what your home needs
          </h2>
          <p className="mt-5 text-body text-slate">
            Transparent pricing, vetted cleaners and supplies included. Tap any
            service to start the booking on WhatsApp.
          </p>
        </div>

        <ul className="js-services-grid mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.catalogName} className="js-service-card">
              <a
                href={bookServiceLink(service.catalogName)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex h-full flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald ${
                  service.featured
                    ? "border-emerald/30 bg-emerald-tint"
                    : "border-line bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-small font-medium text-slate">
                    {service.category}
                  </span>
                  {service.featured && (
                    <span className="rounded-full bg-emerald px-3 py-1 text-small font-semibold text-white">
                      Most booked
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-title">{service.name}</h3>
                <p className="mt-3 flex-1 text-small text-slate">
                  {service.blurb}
                </p>

                <div className="mt-7 flex items-end justify-between border-t border-line/70 pt-5">
                  <div>
                    <span className="text-display-m text-ink">
                      {service.priceAed}
                    </span>
                    <span className="ml-1.5 text-small font-medium text-slate">
                      AED
                    </span>
                    <p className="mt-1 text-small text-slate">
                      {service.duration}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-small font-semibold text-emerald-deep transition group-hover:gap-3">
                    <WhatsAppIcon className="h-4 w-4" />
                    Book
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
