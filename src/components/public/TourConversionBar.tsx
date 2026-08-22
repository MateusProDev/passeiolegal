"use client";

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface TourConversionBarProps {
  tourName: string;
  tourPrice?: number;
  whatsappNumber?: string;
}

export default function TourConversionBar({ tourName, tourPrice, whatsappNumber = "5585997314093" }: TourConversionBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 300;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(window.scrollY > 300);
  }, []);

  if (!isScrolled) return null;

  const whatsappMessage = encodeURIComponent(`Olá! Gostaria de reservar o passeio: ${tourName}${tourPrice ? ` - R$ ${tourPrice.toFixed(2)}` : ''}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50 animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Preço e info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 font-medium">Passeio selecionado</p>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{tourName}</p>
            </div>
            {tourPrice && (
              <div className="bg-green-50 px-3 py-1.5 rounded-lg">
                <span className="text-lg font-bold text-green-700">R$ {tourPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Botão CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 min-h-[44px]"
            aria-label={`Reservar ${tourName} pelo WhatsApp`}
          >
            <MessageCircle size={20} />
            <span className="hidden sm:inline">Reservar agora</span>
            <span className="sm:hidden">Reservar</span>
          </a>
        </div>
      </div>
    </div>
  );
}
