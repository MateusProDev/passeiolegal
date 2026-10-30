"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Star } from 'lucide-react';
import WhatsAppConversionLink from './WhatsAppConversionLink';
import RecommendedTransfers from './RecommendedTransfers';
import type { Transfer } from '@/types';

interface TransfersProps {
  transfers: Transfer[];
  titleEnabled?: boolean;
  descriptionEnabled?: boolean;
}

export default function Transfers({ transfers, titleEnabled = true, descriptionEnabled = true }: TransfersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 3;

  useEffect(() => {
    try {
      const liked = JSON.parse(localStorage.getItem('pl_liked_transfers') || '[]');
      const fav = JSON.parse(localStorage.getItem('pl_fav_transfers') || '[]');
      setLikedIds(new Set(liked));
      setFavIds(new Set(fav));
    } catch {}
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('pl_liked_transfers', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleFav = (id: string) => {
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('pl_fav_transfers', JSON.stringify([...next]));
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

  const featuredTransfers = transfers.filter((transfer) => transfer.featuredOnHome);
  const displayTransfers = featuredTransfers.length > 0 ? featuredTransfers : transfers.slice(0, 6);
  const otherTransfers = featuredTransfers.length > 0
    ? transfers.filter((transfer) => !transfer.featuredOnHome)
    : transfers.slice(6);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setIsPaused(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener?.('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener?.('change', updateReducedMotion);
  }, []);

  const totalGroups = Math.max(1, Math.ceil(displayTransfers.length / itemsPerPage));

  useEffect(() => {
    if (displayTransfers.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalGroups);
    }, 9000);

    return () => clearInterval(timer);
  }, [displayTransfers.length, itemsPerPage, isPaused, totalGroups]);

  const goToSlide = (index: number) => {
    setCurrentIndex(((index % totalGroups) + totalGroups) % totalGroups);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  };

  const startIndex = currentIndex * itemsPerPage;
  const visibleTransfers = displayTransfers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
    <section id="transfers" className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {titleEnabled && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Serviços de Transfer
          </h2>}
          {descriptionEnabled && <p className="text-gray-600 max-w-2xl mx-auto">
            Conforto e segurança em seus deslocamentos com nossa frota moderna
          </p>}
        </div>

        <div className="relative">
          {/* Carousel */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-2 md:px-0 transition-all duration-300 ease-out"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
          >
            {visibleTransfers.map((transfer) => (
              <div key={transfer.id} className="relative group">
                {displayTransfers.length > itemsPerPage && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                      aria-label={`Transfer anterior: ${transfer.name}`}
                    >
                      <ChevronLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                      aria-label={`Próximo transfer: ${transfer.name}`}
                    >
                      <ChevronRight size={20} className="md:w-6 md:h-6" />
                    </button>
                  </>
                )}
                <article
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ease-out flex flex-col group cursor-pointer"
                  onClick={() => { window.location.href = `/transfer/${transfer.slug || transfer.id}`; }}
                >
                <div className="relative h-40 mb-4 w-full">
                  {transfer.imageUrl ? (
                    <Image
                      src={transfer.imageUrl}
                      alt={transfer.imageAlt || transfer.name}
                      fill
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) calc(50vw - 2rem), calc(100vw - 2rem)"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>

                <h3 className="mb-2">
                  <span className="block text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {transfer.name}
                  </span>
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(transfer.id); }}
                    className={`p-2 rounded-full transition-colors ${likedIds.has(transfer.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                    aria-label={likedIds.has(transfer.id) ? 'Remover curtida' : 'Curtir'}
                  >
                    <Heart size={18} fill={likedIds.has(transfer.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFav(transfer.id);
                      const url = `${window.location.origin}/transfer/${transfer.slug || transfer.id}`;
                      addBookmark(url, transfer.name);
                    }}
                    className={`p-2 rounded-full transition-colors ${favIds.has(transfer.id) ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                    aria-label={favIds.has(transfer.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Star size={18} fill={favIds.has(transfer.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="mt-auto">
                  <WhatsAppConversionLink
                    href={`https://wa.me/5585997314093?text=${encodeURIComponent(`Olá! Gostaria de reservar o transfer: ${transfer.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm"
                    aria-label={`Reservar ${transfer.name} pelo WhatsApp`}
                  >
                    <MessageCircle size={18} />
                    <span className="whitespace-nowrap">Reservar pelo WhatsApp</span>
                  </WhatsAppConversionLink>
                </div>
                </article>
              </div>
            ))}
          </div>

          {/* Dots */}
          {displayTransfers.length > itemsPerPage && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalGroups }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
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

        <div className="text-center mt-12">
          <Link
            href="/transfer"
            className="inline-block bg-secondary-800 hover:bg-secondary-900 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Ver Todos os Transfers
          </Link>
        </div>
      </div>
    </section>
    {otherTransfers.length > 0 && (
      <RecommendedTransfers transfers={otherTransfers} />
    )}
    </>
  );
}
