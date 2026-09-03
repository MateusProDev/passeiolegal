import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";

export const metadata: Metadata = {
  title: "Blog de Turismo em Fortaleza e Ceará",
  description: "Dicas de turismo, praias, passeios e destinos no Ceará para planejar sua próxima viagem com a Passeio Legal.",
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/blog`,
    title: "Blog de Turismo | Passeio Legal",
    description: "Dicas para conhecer Fortaleza, o Ceará e os melhores destinos turísticos.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
