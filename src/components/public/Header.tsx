import Image from 'next/image';
import Link from 'next/link';
import { Info, Map, Menu, Newspaper, Phone, type LucideIcon } from 'lucide-react';
import { settingsService } from '@/lib/firestore';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: 'Passeios', href: '/passeios', icon: Map },
  { label: 'Transfer', href: '/transfer', icon: Map },
  { label: 'Blog', href: '/blog', icon: Newspaper },
  { label: 'Sobre', href: '/about', icon: Info },
  { label: 'Contato', href: '/contact', icon: Phone },
];

export default async function Header() {
  const settings = await settingsService.get();
  const logoUrl = settings?.headerLogo;
  const logoAlt = settings?.headerLogoAlt || 'Passeio Legal';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-800/70 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 shadow-md">
      <nav className="container mx-auto px-3 py-3 sm:px-4 sm:py-2" role="navigation" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Passeio Legal - Página inicial">
            {logoUrl ? (
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-white/0 transition-transform duration-200 hover:scale-105 sm:h-[64px] sm:w-[64px] lg:h-[80px] lg:w-[80px]">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/40 bg-white/10 text-lg font-black text-white transition-transform duration-200 hover:scale-105 sm:h-[64px] sm:w-[64px] sm:text-xl lg:h-[80px] lg:w-[80px]">
                PL
              </div>
            )}
          </Link>

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

          <details className="relative md:hidden">
            <summary className="list-none p-2 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer">
              <span className="sr-only">Abrir menu</span>
              <Menu size={24} />
            </summary>

            <div className="absolute right-0 top-full mt-2 w-[86vw] max-w-[320px] rounded-2xl border border-white/10 bg-primary-700/95 p-3 shadow-2xl backdrop-blur-sm">
              <ul className="space-y-2" role="menu">
                {menuItems.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 font-[var(--font-poppins)] text-base font-semibold text-white transition-colors hover:bg-white/20"
                      role="menuitem"
                    >
                      <item.icon size={18} strokeWidth={2.2} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
