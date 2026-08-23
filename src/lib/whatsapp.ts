export const DEFAULT_WHATSAPP_NUMBER = "5585997314093";

interface WhatsAppLinkOptions {
  /** Phone number in any format; non-digits are stripped. */
  phone?: string;
  /** Prefilled message; omitted from the link when empty. */
  message?: string;
}

/** Builds a wa.me deep link with an optional prefilled message. */
export function buildWhatsAppUrl({
  phone = DEFAULT_WHATSAPP_NUMBER,
  message,
}: WhatsAppLinkOptions = {}): string {
  const digits = phone.replace(/\D/g, "");
  const url = `https://wa.me/${digits}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
