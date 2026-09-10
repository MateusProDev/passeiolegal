export const googleAdsConversion = {
  id: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || '11405399413',
  label: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '-lb-CLTxj_McEPWqwr4q',
  name: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_NAME || 'Lead WhatsApp - Passeios',
};

export function trackGoogleAdsLead({
  conversionId = googleAdsConversion.id,
  conversionLabel = googleAdsConversion.label,
  value = 0,
}: {
  conversionId?: string;
  conversionLabel?: string;
  value?: number;
} = {}) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  if (typeof win.gtag === 'function') {
    win.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
      value,
      currency: 'BRL',
    });
    return;
  }

  const img = new Image(1, 1);
  img.src = `https://www.googleadservices.com/pagead/conversion/${conversionId}/?label=${encodeURIComponent(conversionLabel)}&guid=ON&script=0&value=${value}`;
}
