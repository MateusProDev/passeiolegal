import Image from 'next/image';
import { Car, Users } from 'lucide-react';

interface Transfer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  vehicleType: string;
  capacity: number;
}

interface TransfersProps {
  transfers: Transfer[];
}

export default function Transfers({ transfers }: TransfersProps) {
  const displayTransfers = transfers.slice(0, 4);

  return (
    <section id="transfers" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Serviços de Transfer
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conforto e segurança em seus deslocamentos com nossa frota moderna
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTransfers.map((transfer) => (
            <article
              key={transfer.id}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative h-40 mb-4 w-full">
                {transfer.imageUrl ? (
                  <Image
                    src={transfer.imageUrl}
                    alt={transfer.imageAlt || transfer.name}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{transfer.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{transfer.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Car size={16} />
                  <span>{transfer.vehicleType}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{transfer.capacity} pessoas</span>
                </div>
              </div>

              <div className="text-xl font-bold text-primary-600">
                R$ {transfer.price.toFixed(2)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
