import Image from 'next/image';
import Link from 'next/link';
import { Home, Info, Map, Menu, Newspaper, Phone, type LucideIcon } from 'lucide-react';
import { settingsService } from '@/lib/firestore';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: 'Início', href: '/', icon: Home },
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
      <nav className="container mx-auto px-4 py-2" role="navigation" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Passeio Legal - Página inicial">
            {logoUrl ? (
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/10 shadow-sm">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-base font-black text-white shadow-sm">
                PL
              </div>
            )}
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              Passeio Legal
            </span>
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

            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-primary-700 p-2 shadow-lg">
              <ul className="space-y-2" role="menu">
                {menuItems.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 font-[var(--font-poppins)] font-semibold text-white transition-colors hover:bg-white/20"
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
