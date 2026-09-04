export interface Service {
  /** Marketing name shown on the site. */
  name: string;
  /**
   * The exact service name in the admin catalogue. Used in the WhatsApp deep link so the
   * booking assistant recognises the request — keep these in sync with the dashboard.
   */
  catalogName: string;
  blurb: string;
  priceAed: number;
  duration: string;
  category: string;
  /** Draws the highlighted treatment in the grid. */
  featured?: boolean;
}

/**
 * The six services currently Active in the admin dashboard. Inactive ones (1-Hour Cleaning,
 * 2-Hour Cleaning, Recurring Weekly) are deliberately omitted so the site never advertises
 * something the team has switched off.
 */
export const services: Service[] = [
  {
    name: "Deep Clean",
    catalogName: "deep cleaning session",
    blurb:
      "Top-to-bottom detail work on the places everyday cleaning misses — grout, skirting, behind appliances.",
    priceAed: 300,
    duration: "1 hr",
    category: "Deep Cleaning",
    featured: true,
  },
  {
    name: "Home Clean",
    catalogName: "Residential Cleaning (Regular Material)",
    blurb:
      "Your regular refresh: kitchen, bathrooms, floors and living spaces returned to spotless.",
    priceAed: 120,
    duration: "1 hr",
    category: "Regular Home Cleaning",
  },
  {
    name: "Eco Home Clean",
    catalogName: "Residential Cleaning (Organic materials)",
    blurb:
      "The same thorough clean using organic, non-toxic products — safer around children and pets.",
    priceAed: 150,
    duration: "1 hr",
    category: "Regular Home Cleaning",
  },
  {
    name: "Move-In / Move-Out Clean",
    catalogName: "Move-In / Move-Out Deep Clean",
    blurb:
      "Handover-ready in one visit. Ideal for getting a deposit back or starting fresh in a new place.",
    priceAed: 250,
    duration: "2 hrs",
    category: "Move-In / Move-Out",
  },
  {
    name: "Holiday Home Cleaning",
    catalogName: "Holiday Home Cleaning",
    blurb:
      "Fast, reliable turnarounds between guests so your listing is always review-ready.",
    priceAed: 200,
    duration: "2 hrs",
    category: "Deep Cleaning",
  },
  {
    name: "Linen & Ironing",
    catalogName: "Linen Cleaning Services",
    blurb:
      "Washing, pressing and neatly folded linen — collected and returned without the hassle.",
    priceAed: 100,
    duration: "1 hr",
    category: "Ironing",
  },
];

export const serviceAreas = ["Business Bay", "JBR", "Dubai Marina"];
