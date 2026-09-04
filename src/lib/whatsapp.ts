/** The live booking number. Digits only — wa.me rejects spaces and "+". */
export const WHATSAPP_NUMBER = "971504597466";

export const WHATSAPP_DISPLAY = "+971 50 459 7466";

/**
 * Builds a wa.me deep link that opens WhatsApp with a message pre-typed. The customer still has
 * to press send, and from there the AI assistant handles the booking end to end.
 *
 * Pass the service's `catalogName` (not its marketing name) so the assistant recognises it.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function bookServiceLink(catalogName: string): string {
  return whatsappLink(`Hi! I'd like to book a ${catalogName}.`);
}

export const GENERAL_BOOKING_LINK = whatsappLink(
  "Hi! I'd like to book a cleaning.",
);
