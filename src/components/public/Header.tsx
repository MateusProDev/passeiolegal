"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Info, Map, Menu, Newspaper, Phone, X, type LucideIcon } from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const cachedLogo = window.localStorage.getItem('passeiolegal:header-logo');
    if (cachedLogo) {
      setSettings({ headerLogo: cachedLogo });
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          if (data.headerLogo) {
            window.localStorage.setItem('passeiolegal:header-logo', data.headerLogo);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const menuItems: MenuItem[] = [
    { label: 'Início', href: '/', icon: Home },
    ...(settings?.sections?.toursEnabled !== false ? [{ label: 'Passeios', href: '/passeios', icon: Map }] : []),
    ...(settings?.sections?.transfersEnabled !== false ? [{ label: 'Transfer', href: '/transfer', icon: Map }] : []),
    { label: 'Blog', href: '/blog', icon: Newspaper },
    { label: 'Sobre', href: '/about', icon: Info },
    { label: 'Contato', href: '/contact', icon: Phone },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-800/70 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 shadow-md">
      <nav className="container mx-auto px-4 py-2" role="navigation" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Passeio Legal - Página inicial">
            {settings?.headerLogo ? (
              <div className="relative w-20 h-20">
                <Image
                  src={settings.headerLogo}
                  alt={settings.headerLogoAlt || 'Passeio Legal'}
                  fill
                  className="object-contain"
                  priority
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center text-center">
                <span className="text-white font-bold text-sm leading-tight">
                  Passeio Legal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8" role="menubar">
            {menuItems.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 font-[var(--font-poppins)] text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  role="menuitem"
                >
                  <item.icon size={17} strokeWidth={2.2} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="md:hidden mt-4 pb-4 space-y-4" role="menu">
            {menuItems.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 font-[var(--font-poppins)] font-semibold text-white transition-colors hover:bg-white/20"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  <item.icon size={18} strokeWidth={2.2} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
