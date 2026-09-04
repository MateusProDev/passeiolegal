"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Search, SlidersHorizontal } from 'lucide-react';
import { tourService } from '@/lib/firestore';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { getSiteUrl } from '@/lib/site-url';
import { getSiteUrl } from '@/lib/site-url';

const baseUrl = getSiteUrl();

interface Tour {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  mainImageAlt: string;
  price: number;
  duration: string;
  featured: boolean;
  active: boolean;
  slug?: string;
}

export default function PasseiosPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sectionDisabled, setSectionDisabled] = useState(false);
  
  const baseUrl = getSiteUrl();
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Passeios", url: `${baseUrl}/passeios` },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allTours, settingsData] = await Promise.all([
          tourService.getAll(false),
          fetch('/api/settings').then(res => res.ok ? res.json() : null)
        ]);
        
        setTours(allTours);
        setFilteredTours(allTours);
        
        if (settingsData?.sections?.toursEnabled === false) {
          setSectionDisabled(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (sectionDisabled) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Seção Indisponível</h1>
            <p className="text-gray-600 mb-8">A seção de passeios está temporariamente desativada.</p>
            <Link href="/" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
              Voltar para a Página Inicial
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  useEffect(() => {
    let filtered = tours;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter(tour => {
        const duration = tour.duration.toLowerCase();
        if (durationFilter === 'short') return duration.includes('hora') && !duration.includes('dia');
        if (durationFilter === 'medium') return duration.includes('dia') && !duration.includes('semana');
        if (durationFilter === 'long') return duration.includes('semana') || duration.includes('mês');
        return true;
      });
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(tour => tour.featured);
    }

    setFilteredTours(filtered);
  }, [searchTerm, durationFilter, showFeaturedOnly, tours]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <Header />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Passeios</h1>
          <p className="text-xl max-w-2xl">
            Descubra experiências únicas e memoráveis com nossos passeios cuidadosamente selecionados
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar passeios..."
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
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">Duração</label>
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="all">Todas</option>
                  <option value="short">Até 1 dia</option>
                  <option value="medium">1-3 dias</option>
                  <option value="long">Mais de 3 dias</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium">
                  Apenas Destaques
                </label>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredTours.length} {filteredTours.length === 1 ? 'passeio encontrado' : 'passeios encontrados'}
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum passeio encontrado com os filtros selecionados.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setDurationFilter('all');
                setShowFeaturedOnly(false);
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <article
                key={tour.id}
                className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="relative h-48 w-full">
                  {tour.mainImageUrl ? (
                    <Image
                      src={tour.mainImageUrl}
                      alt={tour.mainImageAlt || tour.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  {tour.featured && (
                    <span className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destaque
                    </span>
                  )}
                  {!tour.active && (
                    <span className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Inativo
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{tour.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{tour.duration || 'Consulte'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>Gr pequenos</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/passeios/${tour.slug || tour.id}`}
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
        )}
      </div>
      
      <Footer />
    </main>
  );
}