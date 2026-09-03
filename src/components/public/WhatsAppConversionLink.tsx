"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

const GOOGLE_ADS_SEND_TO = "AW-11405399413/ZmQjCLeD4O0cEPWqwr4q";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface WhatsAppConversionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}

export function isWhatsAppUrl(url: string): boolean {
  return /(^|\/\/)(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(url);
}

function reportWhatsAppConversion(url: string, target?: string | null): void {
  let hasNavigated = false;
  const openedWindow = target === "_blank"
    ? window.open(url, "_blank", "noopener,noreferrer")
    : null;

  const navigate = () => {
    if (hasNavigated) return;
    hasNavigated = true;

    if (target === "_blank") {
      if (!openedWindow) window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  };

  const conversionEvent = {
    send_to: GOOGLE_ADS_SEND_TO,
    event_callback: navigate,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", conversionEvent);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", "conversion", conversionEvent]);
  }

  // Evita bloquear a navegação caso o callback do Google não responda.
  window.setTimeout(navigate, 1200);
}

export default function WhatsAppConversionLink({
  href,
  target,
  children,
  onClick,
  ...props
}: WhatsAppConversionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick?.();
    reportWhatsAppConversion(href, target);
  };

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
