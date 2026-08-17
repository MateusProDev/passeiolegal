"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via cookie
    // Cookie is set by the login API and checked by middleware
    // We just need to verify we're on the admin side
    setIsLoggedIn(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border shadow-lg">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">Passeio Legal</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        <nav className="p-6 space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/banners"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Banners
          </Link>
          <Link
            href="/admin/tours"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Passeios
          </Link>
          <Link
            href="/admin/transfers"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Transfers
          </Link>
          <Link
            href="/admin/testimonials"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Depoimentos
          </Link>
          <Link
            href="/admin/blog"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/admin/faq"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/admin/settings"
            className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Configurações
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 border-t border-border pt-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
