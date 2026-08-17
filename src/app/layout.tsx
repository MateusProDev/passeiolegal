import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Passeio Legal - Tours e Transfers",
    template: "%s | Passeio Legal",
  },
  description: "Descubra os melhores passeios e transfers com a Passeio Legal. Experiências únicas de turismo com conforto e segurança.",
  keywords: ["tours", "transfers", "travel", "passeios", "turismo", "viagens", "excursões"],
  authors: [{ name: "Passeio Legal" }],
  creator: "Passeio Legal",
  publisher: "Passeio Legal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    title: "Passeio Legal - Tours e Transfers",
    description: "Descubra os melhores passeios e transfers",
    siteName: "Passeio Legal",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Passeio Legal - Tours e Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passeio Legal",
    description: "Descubra os melhores passeios e transfers",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@passeiolegal",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={baseUrl} />
      </head>
      <body>
        <LocalBusinessJsonLd
          name="Passeio Legal"
          url={baseUrl}
          description="Descubra os melhores passeios e transfers com a Passeio Legal"
          address={{
            street: "Rua Principal, 123",
            city: "São Paulo",
            state: "SP",
            zip: "01234-567",
          }}
          phone="+5511999999999"
        />
        <WebSiteJsonLd
          name="Passeio Legal"
          url={baseUrl}
          description="Descubra os melhores passeios e transfers com a Passeio Legal"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
