"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

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
  titleEnabled?: boolean;
  descriptionEnabled?: boolean;
  buttonEnabled?: boolean;
}

export default function Hero({
  banners,
  titleEnabled = true,
  descriptionEnabled = true,
  buttonEnabled = true,
}: HeroProps) {
  const availableBanners = banners.filter((banner) => banner?.imageUrl);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= availableBanners.length) {
      setCurrentIndex(0);
    }
  }, [availableBanners.length, currentIndex]);

  useEffect(() => {
    if (availableBanners.length < 2) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % availableBanners.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [availableBanners.length]);

  const safeBanner = availableBanners[currentIndex] || null;

  if (!safeBanner) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center">
        <div className="max-w-3xl text-left text-white px-4 md:px-8">
          <p className="text-orange-300 font-semibold tracking-widest uppercase text-xs md:text-sm mb-3">Fortaleza • Ceará</p>
          {titleEnabled && <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">Passeios e Transfers em Fortaleza e Região</h1>}
          {descriptionEnabled && <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">Reserve experiências únicas com conforto, segurança e atendimento personalizado.</p>}
          <div className="space-y-2 text-sm md:text-base text-white/90">
            <p className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-300" />5/5 no Google com 173 avaliações</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-300" />2.000+ Clientes Satisfeitos</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-300" />Agência de Turismo</p>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = safeBanner;
  const heroTitle = currentBanner.title?.trim() || 'Passeios e Transfers em Fortaleza e Região';

  return (
    <section className="relative h-[600px] overflow-hidden" aria-label="Banner principal">
      <div className="absolute inset-0">
        {currentBanner.imageUrl ? (
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.imageAlt || currentBanner.title || 'Passeios e Transfers em Fortaleza e Região'}
            width={1280}
            height={720}
            className="h-full w-full object-cover"
            sizes="100vw"
            priority
            quality={20}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/50 to-black/40" />
      </div>

      <div className="relative h-full flex items-center text-white px-4 md:px-8">
        <div className="max-w-3xl text-left">
          <p className="text-orange-400 font-semibold tracking-widest uppercase text-xs md:text-sm mb-3">Fortaleza • Ceará</p>
          {titleEnabled && <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            {heroTitle}
          </h1>}
          {descriptionEnabled && <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            {currentBanner.subtitle || 'Reserve experiências únicas em Fortaleza e região.'}
          </p>}
          {buttonEnabled && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={currentBanner.buttonLink}
                target={/^https?:\/\//i.test(currentBanner.buttonLink) ? '_blank' : undefined}
                rel={/^https?:\/\//i.test(currentBanner.buttonLink) ? 'noopener noreferrer' : undefined}
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition-colors text-center"
                aria-label={currentBanner.buttonText}
              >
                {currentBanner.buttonText}
              </a>
              <a
                href="#transfers"
                className="inline-block border border-white/70 hover:border-white hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-full transition-colors text-center backdrop-blur-sm"
              >
                Ver transfers
              </a>
            </div>
          )}
          <div className="space-y-2 text-sm md:text-base text-white/90">
            <p className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-400" />5/5 no Google com 173 avaliações</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-400" />2.000+ Clientes Satisfeitos</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-400" />Agência de Turismo</p>
          </div>
        </div>
      </div>

      {availableBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" aria-label="Selecionar banner">
          {availableBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/60'}`}
              aria-label={`Exibir banner ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
