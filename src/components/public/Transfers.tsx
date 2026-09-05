"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface Transfer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  vehicleType: string;
  capacity: number;
  slug?: string;
}

interface TransfersProps {
  transfers: Transfer[];
}

export default function Transfers({ transfers }: TransfersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const displayTransfers = transfers.slice(0, 8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPage(4);
      } else if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (displayTransfers.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, displayTransfers.length - itemsPerPage);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [displayTransfers.length, itemsPerPage, isPaused]);

  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, displayTransfers.length - itemsPerPage);
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, displayTransfers.length - itemsPerPage);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const visibleTransfers = displayTransfers.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="transfers" className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Serviços de Transfer
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conforto e segurança em seus deslocamentos com nossa frota moderna
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          {displayTransfers.length > itemsPerPage && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-gray-50/90 hover:bg-gray-50 shadow-lg p-3 rounded-full transition-colors z-10"
                aria-label="Transfer anterior"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-gray-50/90 hover:bg-gray-50 shadow-lg p-3 rounded-full transition-colors z-10"
                aria-label="Próximo transfer"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Carousel */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
          >
            {visibleTransfers.map((transfer) => (
              <Link
                key={transfer.id}
                href={`/transfer/${transfer.slug || transfer.id}`}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col group"
                aria-label={`Ver detalhes de ${transfer.name}`}
              >
                <div className="relative h-40 mb-4 w-full">
                  {transfer.imageUrl ? (
                    <Image
                      src={transfer.imageUrl}
                      alt={transfer.imageAlt || transfer.name}
                      fill
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{transfer.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{transfer.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Car size={16} />
                    <span>{transfer.vehicleType || 'Consulte'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href={`/transfer/${transfer.slug || transfer.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    aria-label={`Ver detalhes de ${transfer.name}`}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots */}
          {displayTransfers.length > itemsPerPage && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: Math.ceil(displayTransfers.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index * itemsPerPage)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsPerPage) === index ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Ir para grupo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/transfer"
            className="inline-block bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Ver Todos os Transfers
          </Link>
        </div>
      </div>
    </section>
  );
}