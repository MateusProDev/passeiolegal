"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, MessageCircle, Users } from 'lucide-react';
import { metaPixelEvents } from '@/utils/metaPixel';
import WhatsAppConversionLink from './WhatsAppConversionLink';

interface Tour {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  mainImageAlt: string;
  duration: string;
  slug?: string;
}

interface OtherToursCarouselProps {
  tours: Tour[];
}

export default function OtherToursCarousel({ tours }: OtherToursCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setIsPaused(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener?.('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener?.('change', updateReducedMotion);
  }, []);

  useEffect(() => {
    if (tours.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => {
        const maxIndex = Math.max(0, tours.length - itemsPerPage);
        return previousIndex >= maxIndex ? 0 : previousIndex + 1;
      });
    }, 9000);

    return () => clearInterval(timer);
  }, [itemsPerPage, isPaused, tours.length]);

  const maxIndex = Math.max(0, tours.length - itemsPerPage);
  const visibleTours = tours.slice(currentIndex, currentIndex + itemsPerPage);

  const goToPrevious = () => setCurrentIndex((previousIndex) => Math.max(0, previousIndex - 1));
  const goToNext = () => setCurrentIndex((previousIndex) => Math.min(maxIndex, previousIndex + 1));
  const handleTourClick = (tourName: string) => {
    metaPixelEvents.customEvent('ViewTourList', {
      content_name: tourName,
      content_category: 'Tour',
    });
  };

  return (
    <div className="relative">
      {tours.length > itemsPerPage && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-2 md:p-3 rounded-full transition-colors z-10 border border-gray-200"
            aria-label="Passeio anterior"
          >
            <ChevronLeft size={20} className="text-gray-700 md:w-6 md:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-2 md:p-3 rounded-full transition-colors z-10 border border-gray-200"
            aria-label="Próximo passeio"
          >
            <ChevronRight size={20} className="text-gray-700 md:w-6 md:h-6" />
          </button>
        </>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-2 md:px-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
      >
        {visibleTours.map((tour) => (
          <article key={tour.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col group">
            <div className="relative h-48 w-full">
              {tour.mainImageUrl ? (
                <Image
                  src={tour.mainImageUrl}
                  alt={tour.mainImageAlt || tour.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) calc(50vw - 2rem), calc(100vw - 4rem)"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3>
                <Link
                  href={`/passeios/${tour.slug || tour.id}`}
                  className="block text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors"
                  onClick={() => handleTourClick(tour.name)}
                >
                  {tour.name}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{tour.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{tour.duration || 'Consulte'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>Gr pequenos</span>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
                <WhatsAppConversionLink
                  href={`https://wa.me/5585997314093?text=${encodeURIComponent(`Olá! Gostaria de reservar o passeio: ${tour.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm"
                  aria-label={`Reservar ${tour.name} pelo WhatsApp`}
                >
                  <MessageCircle size={18} />
                  <span className="whitespace-nowrap">Reservar pelo WhatsApp</span>
                </WhatsAppConversionLink>
                <Link
                  href={`/passeios/${tour.slug || tour.id}`}
                  className="flex-shrink-0 text-center bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                  onClick={() => handleTourClick(tour.name)}
                >
                  Ver passeio
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {tours.length > itemsPerPage && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: Math.ceil(tours.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(Math.min(index * itemsPerPage, maxIndex))}
              className="relative flex h-11 w-11 items-center justify-center rounded-full"
              aria-label={`Ir para grupo ${index + 1}`}
            >
              <span className={`h-3 w-3 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerPage) === index ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}