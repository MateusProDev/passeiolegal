"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveTrackingIfNeeded } from '@/lib/tracking/capture';
import { injectTrackingCodeIntoWhatsAppUrl } from '@/lib/tracking/whatsapp';

export default function TrackingProvider() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const consent = localStorage.getItem('lgpd_consent');
    if (consent !== 'true') return;

    const data = saveTrackingIfNeeded(new URLSearchParams(searchParams.toString()));

    if (!data) return;

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: data.code,
        gclid: data.gclid,
        utms: data.utms,
        landingPage: data.landingPage,
        userAgent: data.userAgent,
      }),
    }).catch(() => undefined);
  }, [searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;

      if (!link) return;

      const href = link.getAttribute('href') || '';
      if (!href) return;

      const isWhatsApp = href.includes('wa.me') || href.includes('api.whatsapp.com') || href.includes('whatsapp.com');
      if (!isWhatsApp) return;

      try {
        const currentTracking = localStorage.getItem('lead_tracking');
        if (!currentTracking) return;

        const parsed = JSON.parse(currentTracking) as { code?: string };
        if (!parsed.code) return;

        const finalHref = injectTrackingCodeIntoWhatsAppUrl(href, parsed.code);

        event.preventDefault();

        if (link.target === '_blank') {
          window.open(finalHref, '_blank', 'noopener,noreferrer');
          return;
        }

        window.location.href = finalHref;
      } catch {
        // ignore silently
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
