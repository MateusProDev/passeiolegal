"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  clientPhotoAlt: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const truncateText = (text: string, maxLines: number) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O Que Nossos Clientes Dizem
            </h2>
          </div>
          <p className="text-center text-gray-600">Nenhum depoimento disponível no momento.</p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];
  const isExpanded = expandedIndex === currentIndex;
  const textLines = currentTestimonial.text.split('\n');
  const shouldTruncate = textLines.length > 5;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Histórias reais de experiências memoráveis
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={i < currentTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>

            <blockquote className="text-center mb-8">
              <p className="text-xl text-gray-700 italic leading-relaxed whitespace-pre-line">
                &ldquo;{isExpanded ? currentTestimonial.text : truncateText(currentTestimonial.text, 5)}&rdquo;
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => toggleExpand(currentIndex)}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  {isExpanded ? (
                    <>
                      Ver menos <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Ver mais <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {currentTestimonial.clientPhoto ? (
                  <Image
                    src={currentTestimonial.clientPhoto}
                    alt={currentTestimonial.clientPhotoAlt || currentTestimonial.clientName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Sem foto</span>
                  </div>
                )}
              </div>
              <div>
                <cite className="not-italic font-semibold text-gray-900">
                  {currentTestimonial.clientName}
                </cite>
              </div>
            </div>

            {testimonials.length > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={goToPrevious}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Ir para depoimento ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goToNext}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight size={24} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
