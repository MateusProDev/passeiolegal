"use client";

import Link from "next/link";

export default function BackLink() {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem('passeios-scroll-position', window.scrollY.toString());
    }
  };

  return (
    <Link
      href="/passeios"
      onClick={handleClick}
      className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
      aria-label="Voltar para lista de passeios"
    >
      ← Voltar para passeios
    </Link>
  );
}