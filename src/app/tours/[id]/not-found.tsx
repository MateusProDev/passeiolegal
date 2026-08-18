import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";

export default function TourNotFound() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Passeio não encontrado</h1>
          <p className="text-gray-600 mb-8">
            O passeio que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/#tours"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Ver todos os passeios
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}