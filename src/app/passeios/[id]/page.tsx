import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { tourService } from "@/lib/firestore";
import { Clock, Check, X, Star, Users, AlertCircle, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import TourConversionBar from "@/components/public/TourConversionBar";
import TourTrustBadges from "@/components/public/TourTrustBadges";
import TourFAQ from "@/components/public/TourFAQ";
import RecommendedTours from "@/components/public/RecommendedTours";

interface PageProps {
  params: { id: string };
}

// Force dynamic rendering for real-time updates
export const dynamic = 'force-dynamic';

async function getTour(id: string) {
  try {
    // Tenta buscar pelo slug primeiro, se não encontrar tenta pelo ID
    let tour = await tourService.getBySlug(id);
    if (!tour) {
      tour = await tourService.getById(id);
    }
    return tour;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";
  const tour = await getTour(params.id);

  if (!tour) {
    return {
      title: "Passeio não encontrado | Passeio Legal",
      robots: "noindex, nofollow",
    };
  }

  // SEO: Title otimizado (até 60 caracteres)
  const title = tour.name.length > 50 ? tour.name.substring(0, 50) + "..." : tour.name;
  const fullTitle = `${title} | Passeio Legal - Passeios em Fortaleza`;

  // SEO: Description persuasiva com CTA (até 160 caracteres)
  const description = tour.description 
    ? tour.description.length > 140 
      ? tour.description.substring(0, 140) + "... Reserve agora!" 
      : tour.description + " Reserve agora!"
    : `Reserve ${tour.name} em Fortaleza. Passeio turístico com guia, transporte inclusivo. Garantia de satisfação. Reserve agora!`;

  // SEO: Keywords baseadas no nome do tour
  const keywords = [
    tour.name.toLowerCase(),
    "passeios fortaleza",
    "turismo ceará",
    "passeio legal",
    "passeio fortaleza",
    "excursão fortaleza",
  ].join(", ");

  return {
    title: fullTitle,
    description,
    keywords,
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
      url: `${baseUrl}/passeios/${params.id}`,
      title: tour.name,
      description,
      siteName: "Passeio Legal",
      images: tour.mainImageUrl ? [
        {
          url: tour.mainImageUrl,
          width: 1200,
          height: 630,
          alt: `${tour.name} - Passeio turístico em Fortaleza`,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: tour.name,
      description,
      images: tour.mainImageUrl ? [tour.mainImageUrl] : [],
    },
    alternates: {
      canonical: `${baseUrl}/passeios/${params.id}`,
    },
  };
}

export default async function PasseioDetailPage({ params }: PageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";
  const tour = await getTour(params.id);

  if (!tour) {
    notFound();
  }

  // Busca passeios relacionados para recomendação
  const relatedTours = await tourService.getRelated(tour.id, 3);

  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Passeios", url: `${baseUrl}/passeios` },
    { name: tour.name, url: `${baseUrl}/passeios/${params.id}` },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <Header />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      {/* SEO: JSON-LD Product Schema enriquecido */}
      {tour.mainImageUrl && (
        <ProductJsonLd
          name={tour.name}
          description={tour.description}
          image={tour.mainImageUrl}
          url={`${baseUrl}/passeios/${params.id}`}
        />
      )}

      {/* CTA Sticky Bar - aparece após scroll */}
      <TourConversionBar 
        tourName={tour.name}
      />

      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/passeios"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
            aria-label="Voltar para lista de passeios"
          >
            ← Voltar para passeios
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda - Imagens */}
            <div>
              <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden mb-4 shadow-lg">
                <img
                  src={tour.mainImageUrl}
                  alt={`${tour.name} - Passeio turístico em Fortaleza e região`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {tour.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-md">
                    <Star size={16} />
                    <span>Destaque</span>
                  </div>
                )}
              </div>

              {tour.galleryImages && tour.galleryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {tour.galleryImages.slice(0, 6).map((image) => (
                    <div key={image.id} className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                      <img
                        src={image.url}
                        alt={image.alt || `${tour.name} - Foto adicional`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coluna Direita - Conteúdo */}
            <div>
              {/* Badge de disponibilidade */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Disponível para reserva
                </span>
                {tour.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={14} />
                    Mais vendido
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {tour.name}
              </h1>
              
              {/* Informações rápidas */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock size={18} className="text-blue-600" />
                  <span className="font-medium">{tour.duration || 'Consulte'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Users size={18} className="text-blue-600" />
                  <span className="font-medium">Grupo pequeno</span>
                </div>
              </div>

              {/* Gatilho de escassez */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 text-sm">Últimas vagas disponíveis</p>
                  <p className="text-xs text-orange-700 mt-1">Reserve agora para garantir sua vaga neste passeio exclusivo.</p>
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Sobre este passeio</h2>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </div>

              {tour.longDescription && (
                <div className="mb-8">
                  <details className="group">
                    <summary className="cursor-pointer text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                      Ler descrição completa
                      <ChevronDown size={18} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                      {tour.longDescription}
                    </p>
                  </details>
                </div>
              )}

              {/* O que está incluído */}
              {tour.includesItems && tour.includesItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check size={22} className="text-green-600" />
                    O que está incluído
                  </h2>
                  <ul className="space-y-3">
                    {tour.includesItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600">
                        <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* O que não está incluído */}
              {tour.excludesItems && tour.excludesItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <X size={22} className="text-red-600" />
                    O que não está incluído
                  </h2>
                  <ul className="space-y-3">
                    {tour.excludesItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600">
                        <X size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selos de Confiança */}
      <TourTrustBadges />

      {/* FAQ */}
      <TourFAQ />

      {/* Passeios Recomendados */}
      <RecommendedTours tours={relatedTours} />

      <Footer />
    </main>
  );
}