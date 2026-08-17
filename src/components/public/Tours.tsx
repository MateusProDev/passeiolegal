import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  mainImageAlt: string;
  price: number;
  duration: string;
  featured: boolean;
}

interface ToursProps {
  tours: Tour[];
}

export default function Tours({ tours }: ToursProps) {
  const featuredTours = tours.filter((tour) => tour.featured);
  const displayTours = featuredTours.length > 0 ? featuredTours : tours.slice(0, 6);

  return (
    <section id="tours" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Passeios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra experiências únicas e memoráveis com nossos passeios cuidadosamente selecionados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTours.map((tour) => (
            <article
              key={tour.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={tour.mainImageUrl}
                  alt={tour.mainImageAlt}
                  fill
                  className="object-cover"
                />
                {tour.featured && (
                  <span className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Destaque
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>Gr pequenos</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    R$ {tour.price.toFixed(2)}
                  </div>
                  <Link
                    href={`/tours/${tour.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    aria-label={`Ver detalhes de ${tour.name}`}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {tours.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-block bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              Ver Todos os Passeios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
