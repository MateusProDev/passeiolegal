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
  trackConversion?: boolean;
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

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      const args = Array.from(arguments);
      window.dataLayer?.push(args);
    };
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", conversionEvent);
  } else {
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
  trackConversion = true,
  ...props
}: WhatsAppConversionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isWhatsAppUrl(href)) return;

    const isPrimaryClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPrimaryClick) return;

    event.preventDefault();
    onClick?.();

    if (trackConversion) {
      reportWhatsAppConversion(href, target);
      return;
    }

    if (target === "_blank") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = href;
  };

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
