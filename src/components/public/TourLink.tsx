"use client";

import Link from "next/link";

interface TourLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function TourLink({ href, children, className, ariaLabel }: TourLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem('passeios-scroll-position', window.scrollY.toString());
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}