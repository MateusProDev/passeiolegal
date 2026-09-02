"use client";

import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { metaPixelEvents } from '@/utils/metaPixel';

interface SocialLink {
  icon: any;
  href: string;
  label: string;
  onClick?: () => void;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    metaPixelEvents.contact({
      content_name: 'Footer WhatsApp',
      content_category: 'Contact'
    });
  };

  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: MessageCircle, href: '#', label: 'WhatsApp', onClick: handleWhatsAppClick },
  ];

  const quickLinks = [
    { label: 'Início', href: '/' },
    ...(settings?.sections?.toursEnabled !== false ? [{ label: 'Passeios', href: '/passeios' }] : []),
    ...(settings?.sections?.transfersEnabled !== false ? [{ label: 'Transfer', href: '/transfer' }] : []),
    { label: 'Blog', href: '/blog' },
    { label: 'Sobre', href: '/about' },
    { label: 'Contato', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="container mx-auto px-4 pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {settings?.headerLogo ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={settings.headerLogo}
                    alt={settings.headerLogoAlt || 'Passeio Legal'}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">PL</span>
                </div>
              )}
              <span className="text-xl font-bold">Passeio Legal</span>
            </div>
            <p className="text-gray-400 text-sm">
              Descubra os melhores passeios e transfers com conforto, segurança e experiências únicas de turismo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              {settings?.contactInfo?.phone && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Phone size={18} />
                  <span>{settings.contactInfo.phone}</span>
                </li>
              )}
              {settings?.contactInfo?.email && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Mail size={18} />
                  <span>{settings.contactInfo.email}</span>
                </li>
              )}
              {settings?.contactInfo?.whatsapp && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <MessageCircle size={18} />
                  <span>{settings.contactInfo.whatsapp}</span>
                </li>
              )}
              {settings?.contactInfo?.address && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <MapPin size={18} />
                  <span>{settings.contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (social.onClick) {
                      social.onClick();
                    }
                  }}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <div className="mt-5 flex flex-col items-center gap-0 sm:flex-row sm:items-center sm:gap-2">
              <div className="relative h-16 w-44 sm:h-20">
                <Image
                  src="/cadastur.png"
                  alt="Cadastur"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-16 w-44 sm:h-20">
                <Image
                  src="/seguranca.png"
                  alt="Site certificado e seguro"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-16 w-44 sm:h-20">
                <Image
                  src="/pagamentos.png"
                  alt="Formas de pagamento"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 pb-4 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Passeio Legal. Todos os direitos reservados.</p>
          <a
            href="https://turvia.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 hover:text-white transition-colors"
          >
            Desenvolvido por TURVIA
          </a>
        </div>
      </div>
    </footer>
  );
}
