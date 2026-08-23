"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Users, Search, SlidersHorizontal } from 'lucide-react';
import { transferService } from '@/lib/firestore';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Transfer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  vehicleType: string;
  capacity: number;
  active: boolean;
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [capacityFilter, setCapacityFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://passeiolegal.com";
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Transfers", url: `${baseUrl}/transfers` },
  ];

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const allTransfers = await transferService.getAll(false);
        setTransfers(allTransfers);
        setFilteredTransfers(allTransfers);
      } catch (error) {
        console.error('Error fetching transfers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  useEffect(() => {
    let filtered = transfers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transfer =>
        transfer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Capacity filter
    if (capacityFilter !== 'all') {
      filtered = filtered.filter(transfer => {
        if (capacityFilter === 'small') return transfer.capacity <= 4;
        if (capacityFilter === 'medium') return transfer.capacity > 4 && transfer.capacity <= 8;
        if (capacityFilter === 'large') return transfer.capacity > 8;
        return true;
      });
    }

    setFilteredTransfers(filtered);
  }, [searchTerm, capacityFilter, transfers]);

  if (loading) {
    return (
      <LoadingSpinner fullScreen />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Transfers</h1>
          <p className="text-xl max-w-2xl">
            Serviços de transfer confortáveis e seguros para todos os seus destinos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <SlidersHorizontal size={20} />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 gap-4 pt-6 border-t">
              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium mb-2">Capacidade</label>
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="all">Todas</option>
                  <option value="small">Até 4 pessoas</option>
                  <option value="medium">4-8 pessoas</option>
                  <option value="large">Mais de 8 pessoas</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredTransfers.length} {filteredTransfers.length === 1 ? 'transfer encontrado' : 'transfers encontrados'}
          </div>
        </div>

        {/* Transfers Grid */}
        {filteredTransfers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum transfer encontrado com os filtros selecionados.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCapacityFilter('all');
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransfers.map((transfer) => (
              <article
                key={transfer.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="relative h-48 w-full">
                  {transfer.imageUrl ? (
                    <Image
                      src={transfer.imageUrl}
                      alt={transfer.imageAlt || transfer.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  {!transfer.active && (
                    <span className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Inativo
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{transfer.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{transfer.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Car size={16} />
                      <span>{transfer.vehicleType || 'Consulte'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/transfers/${transfer.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      aria-label={`Ver detalhes de ${transfer.name}`}
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
