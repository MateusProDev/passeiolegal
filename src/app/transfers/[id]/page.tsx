import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { transferService } from "@/lib/firestore";
import { Car, Users, Check, X } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

// Force dynamic rendering for real-time updates
export const dynamic = 'force-dynamic';

async function getTransfer(id: string) {
  try {
    const transfer = await transferService.getById(id);
    return transfer;
  } catch (error) {
    console.error("Error fetching transfer:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const transfer = await getTransfer(params.id);

  if (!transfer) {
    return {
      title: "Transfer não encontrado",
    };
  }

  return {
    title: transfer.name,
    description: transfer.description,
  };
}

export default async function TransferDetailPage({ params }: PageProps) {
  const transfer = await getTransfer(params.id);

  if (!transfer) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/#transfers"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            ← Voltar para transfers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative h-96 rounded-xl overflow-hidden mb-6">
                <img
                  src={transfer.imageUrl}
                  alt={transfer.imageAlt || transfer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{transfer.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Car size={20} />
                  <span>{transfer.vehicleType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={20} />
                  <span>{transfer.capacity} pessoas</span>
                </div>
                {transfer.price && transfer.price > 0 && (
                  <div className="text-3xl font-bold text-primary-600">
                    R$ {transfer.price.toFixed(2)}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-8">{transfer.description}</p>

              {transfer.features && transfer.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Características</h2>
                  <ul className="space-y-2">
                    {transfer.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <Check size={20} className="text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <Link
                  href="https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o transfer: ${encodeURIComponent(transfer.name)}"
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
