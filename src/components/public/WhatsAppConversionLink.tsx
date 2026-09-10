"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

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

    const codeFromStorage = (() => {
      try {
        const raw = localStorage.getItem('lead_tracking');
        if (!raw) return null;
        return JSON.parse(raw)?.code || null;
      } catch {
        return null;
      }
    })();

    if (codeFromStorage) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          event: 'clicou_whatsapp',
          code: codeFromStorage,
          gclid: null,
          utms: {},
          landingPage: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => undefined);
    }

    if (trackConversion) {
      // O clique em WhatsApp é evento secundário e não deve contar como conversão final.
      // A conversão real só deve ocorrer quando o status do lead virar 'fechou' no painel admin.
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'clicou_whatsapp', {
          event_category: 'whatsapp',
          event_label: codeFromStorage || 'lead_sem_codigo',
        });
      }

      if (target === '_blank') {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }

      window.location.href = href;
      return;
    }

    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer');
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
