"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (banners.length === 0 || isPaused) return;
    
    const interval = 50; // Update progress every 50ms
    const duration = 5000; // 5 seconds per slide
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Passeio Legal</h1>
          <p className="text-xl md:text-2xl mb-8">Descubra experiências únicas de turismo</p>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section
      className="relative h-[600px] overflow-hidden"
      aria-label="Banner principal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
    >
      {/* Banner Image */}
      <div className="absolute inset-0">
        {currentBanner.imageUrl ? (
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.imageAlt || currentBanner.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Banner Content */}
      <div className="relative h-full flex items-center justify-center text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            {currentBanner.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in">
            {currentBanner.subtitle}
          </p>
          <WhatsAppConversionLink
            href={currentBanner.buttonLink}
            target={isWhatsAppUrl(currentBanner.buttonLink) ? '_blank' : undefined}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-poppins font-bold px-8 py-3 rounded-lg transition-colors"
            aria-label={currentBanner.buttonText}
          >
            {currentBanner.buttonText}
          </WhatsAppConversionLink>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100/30 hover:bg-gray-100/50 p-3 rounded-full transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100/30 hover:bg-gray-100/50 p-3 rounded-full transition-colors"
            aria-label="Próximo banner"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}

      {/* Progress Bar */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/30">
          <div
            className="h-full bg-gray-100 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
                setProgress(0);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-100' : 'bg-gray-100/50'
              }`}
              aria-label={`Ir para banner ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
