"use client";

import Image from 'next/image';
import WhatsAppConversionLink, { isWhatsAppUrl } from './WhatsAppConversionLink';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroProps {
  banners: Banner[];
}

export default function Hero({ banners }: HeroProps) {
  const safeBanner = banners.find((banner) => banner?.imageUrl)?.imageUrl
    ? banners.find((banner) => banner?.imageUrl)
    : null;

  if (!safeBanner) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Passeios e Transfers em Fortaleza e Região</h1>
          <p className="text-xl md:text-2xl mb-8">Reserve experiências únicas com conforto, segurança e atendimento personalizado.</p>
        </div>
      </section>
    );
  }

  const currentBanner = safeBanner;
  const normalizedTitle = currentBanner.title?.trim();
  const heroTitle = normalizedTitle && !normalizedTitle.toLowerCase().includes('top 3')
    ? normalizedTitle
    : 'Passeios e Transfers em Fortaleza e Região';

  return (
    <section className="relative h-[600px] overflow-hidden" aria-label="Banner principal">
      <div className="absolute inset-0">
        {currentBanner.imageUrl ? (
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.imageAlt || currentBanner.title || 'Passeios e Transfers em Fortaleza e Região'}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={70}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full flex items-center justify-center text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in">
            {currentBanner.subtitle || 'Reserve experiências únicas em Fortaleza e região.'}
          </p>
          <WhatsAppConversionLink
            href={currentBanner.buttonLink}
            target={isWhatsAppUrl(currentBanner.buttonLink) ? '_blank' : undefined}
            className="inline-block bg-primary-800 hover:bg-primary-900 text-white font-poppins font-bold px-8 py-3 rounded-lg transition-colors"
            aria-label={currentBanner.buttonText}
          >
            {currentBanner.buttonText}
          </WhatsAppConversionLink>
        </div>
      </div>
    </section>
  );
}
