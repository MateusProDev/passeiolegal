import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { tourService } from "@/lib/firestore";
import { Clock, Check, X, Star } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

// Force dynamic rendering for real-time updates
export const dynamic = 'force-dynamic';

async function getTour(id: string) {
  try {
    const tour = await tourService.getById(id);
    return tour;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tour = await getTour(params.id);

  if (!tour) {
    return {
      title: "Tour não encontrado",
    };
  }

  return {
    title: tour.name,
    description: tour.description,
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const tour = await getTour(params.id);

  if (!tour) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28">
      <Header />

      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/#tours"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            ← Voltar para passeios
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative h-96 rounded-xl overflow-hidden mb-6">
                <img
                  src={tour.mainImageUrl}
                  alt={tour.mainImageAlt}
                  className="w-full h-full object-cover"
                />
                {tour.featured && (
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                    <Star size={16} />
                    Destaque
                  </div>
                )}
              </div>

              {tour.galleryImages && tour.galleryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {tour.galleryImages.map((image) => (
                    <div key={image.id} className="relative h-24 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={20} />
                  <span>{tour.duration}</span>
                </div>
                {tour.price && tour.price > 0 && (
                  <div className="text-3xl font-bold text-primary-600">
                    R$ {tour.price.toFixed(2)}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-8">{tour.description}</p>

              {tour.longDescription && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o passeio</h2>
                  <p className="text-gray-600 whitespace-pre-line">{tour.longDescription}</p>
                </div>
              )}

              {tour.includesItems && tour.includesItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">O que está incluído</h2>
                  <ul className="space-y-2">
                    {tour.includesItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <Check size={20} className="text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.excludesItems && tour.excludesItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">O que não está incluído</h2>
                  <ul className="space-y-2">
                    {tour.excludesItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <X size={20} className="text-red-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <Link
                  href="https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o passeio: ${encodeURIComponent(tour.name)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
                >
                  Reservar pelo WhatsApp
                </Link>
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

      <Footer />
    </main>
  );
}