import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { SmoothScroll } from "@/components/providers/SmoothScroll";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omgcleaninguae.com"),
  title: "OMG Cleaning — Professional Home Cleaning in Dubai",
  description:
    "Book a vetted cleaner in Dubai over WhatsApp in under a minute. Deep cleaning, regular home cleaning, move-in/move-out and holiday homes across Business Bay, JBR and Dubai Marina.",
  openGraph: {
    title: "OMG Cleaning — Professional Home Cleaning in Dubai",
    description:
      "Book a vetted cleaner in Dubai over WhatsApp in under a minute.",
    type: "website",
    locale: "en_AE",
  },
  icons: { icon: "/omg-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* The hero copy is hidden by default in CSS so it cannot flash before GSAP takes over.
            That would strand it permanently if scripting were off, so this restores it in exactly
            that case. Inverting the test this way keeps it pure markup — an inline script that
            stamped a class on <html> would mutate the DOM before React hydrated, which React
            reports as a mismatch. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".js-word,.js-room-word{opacity:1!important}.js-hero-copy,.js-room-copy{opacity:1!important;visibility:visible!important}.js-scroll-hint{display:none}",
            }}
          />
        </noscript>
      </head>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
