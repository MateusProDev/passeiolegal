"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { metaPixelEvents } from '@/utils/metaPixel';

interface Tour {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  mainImageAlt: string;
  price: number;
  duration: string;
  featured: boolean;
  slug?: string;
}

interface ToursProps {
  tours: Tour[];
}

export default function Tours({ tours }: ToursProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const featuredTours = tours.filter((tour) => tour.featured);
  const displayTours = featuredTours.length > 0 ? featuredTours : tours.slice(0, 6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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

  const handleTourClick = (tourName: string) => {
    metaPixelEvents.customEvent('ViewTourList', {
      content_name: tourName,
      content_category: 'Tour'
    });
  };

  useEffect(() => {
    if (displayTours.length <= itemsPerPage) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, displayTours.length - itemsPerPage);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [displayTours.length, itemsPerPage]);

  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, displayTours.length - itemsPerPage);
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, displayTours.length - itemsPerPage);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const visibleTours = displayTours.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="tours" className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Passeios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra experiências únicas e memoráveis com nossos passeios cuidadosamente selecionados
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          {displayTours.length > itemsPerPage && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white/80 hover:bg-white/95 shadow-lg p-3 rounded-full transition-colors z-10"
                aria-label="Passeio anterior"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white/80 hover:bg-white/95 shadow-lg p-3 rounded-full transition-colors z-10"
                aria-label="Próximo passeio"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTours.map((tour) => (
              <Link
                key={tour.id}
                href={`/passeios/${tour.slug || tour.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col group"
                aria-label={`Ver detalhes de ${tour.name}`}
                onClick={() => handleTourClick(tour.name)}
              >
                <div className="relative h-48 w-full">
                  {tour.mainImageUrl ? (
                    <Image
                      src={tour.mainImageUrl}
                      alt={tour.mainImageAlt || tour.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  {tour.featured && (
                    <span className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destaque
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{tour.name}</h3>
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

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/passeios/${tour.slug || tour.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      aria-label={`Ver detalhes de ${tour.name}`}
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots */}
          {displayTours.length > itemsPerPage && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: Math.ceil(displayTours.length / itemsPerPage) }).map((_, index) => (
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
            href="/passeios"
            className="inline-block bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Ver Todos os Passeios
          </Link>
        </div>
      </div>
    </section>
  );
}