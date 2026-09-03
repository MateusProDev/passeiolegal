import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { faqService, transferService } from "@/lib/firestore";
import { Car, Users } from "lucide-react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import * as Types from "@/types";
import DetailGallery from "@/components/public/DetailGallery";
import WhatsAppConversionLink from "@/components/public/WhatsAppConversionLink";
import FAQ from "@/components/public/FAQ";

interface PageProps {
  params: { id: string };
}

// Force dynamic rendering for real-time updates
export const dynamic = 'force-dynamic';

async function getTransfer(id: string): Promise<Types.Transfer | null> {
  try {
    // Tenta buscar pelo slug primeiro, se não encontrar tenta pelo ID
    const transfer = await transferService.getBySlug(id);
    if (transfer) return transfer;
    return await transferService.getById(id);
  } catch (error) {
    console.error("Error fetching transfer:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";
  const transfer = await getTransfer(params.id);

  if (!transfer) {
    return {
      title: "Transfer não encontrado | Passeio Legal",
    };
  }

  return {
    title: `${transfer.name} | Passeio Legal`,
    description: transfer.description || `Reserve ${transfer.name} com a Passeio Legal. Serviços de transfer em Fortaleza e região com conforto e segurança.`,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/transfer/${params.id}`,
      title: transfer.name,
      description: transfer.description,
      images: transfer.imageUrl ? [
        {
          url: transfer.imageUrl,
          width: 1200,
          height: 630,
          alt: transfer.imageAlt || transfer.name,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: transfer.name,
      description: transfer.description,
      images: transfer.imageUrl ? [transfer.imageUrl] : [],
    },
    alternates: {
      canonical: `${baseUrl}/transfer/${params.id}`,
    },
  };
}

export default async function TransferDetailPage({ params }: PageProps) {
  const transfer = await getTransfer(params.id);

  if (!transfer) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Transfer", url: `${baseUrl}/transfer` },
    { name: transfer.name, url: `${baseUrl}/transfer/${params.id}` },
  ];
  const galleryImages = [
    {
      id: "main",
      url: transfer.imageUrl,
      alt: transfer.imageAlt,
      order: 0,
    },
    ...(transfer.galleryImages || []),
  ].filter((image) => image.url);
  const faqs = await faqService.getAll();
  const whatsappUrl = `https://wa.me/5585997314093?text=${encodeURIComponent(`Olá, gostaria de saber mais sobre o transfer: ${transfer.name}`)}`;

  return (
    <main className="min-h-screen pt-24">
      <Header />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/transfer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            ← Voltar para transfer
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <DetailGallery
                images={galleryImages}
                alt={transfer.imageAlt || transfer.name}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{transfer.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Car size={20} />
                  <span>{transfer.vehicleType || 'Consulte'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={20} />
                  <span>{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-8">{transfer.description}</p>

              <div className="flex gap-4">
                <WhatsAppConversionLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
                >
                  Reservar pelo WhatsApp
                </WhatsAppConversionLink>
                <Link
                  href="#contact"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
                >
                  Fale Conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQ faqs={faqs} />

      <Footer />
    </main>
  );
}