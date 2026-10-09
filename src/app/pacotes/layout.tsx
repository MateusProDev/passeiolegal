import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Passeios e Transfers em Fortaleza | Passeio Legal",
  description: "Encontre passeios para conhecer Fortaleza e região, além de transfers para viajar com conforto.",
  alternates: { canonical: `${baseUrl}/pacotes` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/pacotes`,
    title: "Passeios e Transfers em Fortaleza | Passeio Legal",
    description: "Encontre passeios para conhecer Fortaleza e região, além de transfers para viajar com conforto.",
  },
};

export default function PacotesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
