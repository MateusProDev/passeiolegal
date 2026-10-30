"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Star } from 'lucide-react';
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
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 3;

  useEffect(() => {
    try {
      const liked = JSON.parse(localStorage.getItem('pl_liked_tours') || '[]');
      const fav = JSON.parse(localStorage.getItem('pl_fav_tours') || '[]');
      setLikedIds(new Set(liked));
      setFavIds(new Set(fav));
    } catch {}
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('pl_liked_tours', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleFav = (id: string) => {
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('pl_fav_tours', JSON.stringify([...next]));
      return next;
    });
  };

  const addBookmark = (url: string, title: string) => {
    try {
      const win = window as any;
      if (win.external && 'AddFavorite' in win.external) {
        win.external.AddFavorite(url, title);
      } else if (win.sidebar && win.sidebar.addPanel) {
        win.sidebar.addPanel(title, url, '');
      } else {
        window.open(url, '_blank');
        alert('Para favoritar, use Ctrl+D / Cmd+D nesta página.');
      }
    } catch {}
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setIsPaused(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener?.('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener?.('change', updateReducedMotion);
  }, []);

  const totalGroups = Math.max(1, Math.ceil(tours.length / itemsPerPage));

  useEffect(() => {
    if (tours.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % totalGroups);
    }, 9000);

    return () => clearInterval(timer);
  }, [itemsPerPage, isPaused, tours.length, totalGroups]);

  const visibleTours = tours.length === 0
    ? []
    : Array.from({ length: itemsPerPage }, (_, index) => {
        const itemIndex = (currentIndex * itemsPerPage + index) % tours.length;
        return tours[itemIndex];
      });

  const goToPrevious = () => setCurrentIndex((previousIndex) => (previousIndex - 1 + totalGroups) % totalGroups);
  const goToNext = () => setCurrentIndex((previousIndex) => (previousIndex + 1) % totalGroups);
  const handleTourClick = (tourName: string) => {
    metaPixelEvents.customEvent('ViewTourList', {
      content_name: tourName,
      content_category: 'Tour',
    });
  };

  return (
    <div className="relative">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-2 md:px-0 transition-all duration-300 ease-out"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
      >
        {visibleTours.map((tour) => (
          <div key={tour.id} className="relative group">
            {tours.length > itemsPerPage && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                  aria-label={`Passeio anterior: ${tour.name}`}
                >
                  <ChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                  aria-label={`Próximo passeio: ${tour.name}`}
                >
                  <ChevronRight size={20} className="md:w-6 md:h-6" />
                </button>
              </>
            )}
            <article className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-out flex flex-col group">
            <div className="relative aspect-square w-full overflow-hidden">
              {tour.mainImageUrl ? (
                <Image
                  src={tour.mainImageUrl}
                  alt={tour.mainImageAlt || tour.name}
                  fill
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) calc(50vw - 2rem), calc(100vw - 4rem)"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="mb-2">
                <Link
                  href={`/passeios/${tour.slug || tour.id}`}
                  className="block text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2"
                  onClick={() => handleTourClick(tour.name)}
                >
                  {tour.name}
                </Link>
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(tour.id); }}
                  className={`p-2 rounded-full transition-colors ${likedIds.has(tour.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  aria-label={likedIds.has(tour.id) ? 'Remover curtida' : 'Curtir'}
                >
                  <Heart size={18} fill={likedIds.has(tour.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFav(tour.id);
                    const url = `${window.location.origin}/passeios/${tour.slug || tour.id}`;
                    addBookmark(url, tour.name);
                  }}
                  className={`p-2 rounded-full transition-colors ${favIds.has(tour.id) ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                  aria-label={favIds.has(tour.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star size={18} fill={favIds.has(tour.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="mt-auto">
                <WhatsAppConversionLink
                  href={`https://wa.me/5585997314093?text=${encodeURIComponent(`Olá! Gostaria de reservar o passeio: ${tour.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm"
                  aria-label={`Reservar ${tour.name} pelo WhatsApp`}
                >
                  <MessageCircle size={18} />
                  <span className="whitespace-nowrap">Reservar pelo WhatsApp</span>
                </WhatsAppConversionLink>
              </div>
            </div>
            </article>
          </div>
        ))}
      </div>

      {tours.length > itemsPerPage && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full"
              aria-label={`Ir para grupo ${index + 1}`}
            >
              <span className={`h-3 w-3 rounded-full transition-colors ${
                currentIndex === index ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}