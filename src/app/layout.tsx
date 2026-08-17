import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Passeio Legal - Tours e Transfers",
    template: "%s | Passeio Legal",
  },
  description: "Descubra os melhores passeios e transfers com a Passeio Legal",
  keywords: ["tours", "transfers", "travel", "passeios"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://passeiolegal.com.br",
    title: "Passeio Legal - Tours e Transfers",
    description: "Descubra os melhores passeios e transfers",
    images: [
      {
        url: "https://passeiolegal.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Passeio Legal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passeio Legal",
    description: "Descubra os melhores passeios e transfers",
    images: ["https://passeiolegal.com.br/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
