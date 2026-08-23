"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTestimonials } from "@/hooks/useApi";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TestimonialsAdmin() {
  const { data: testimonials, loading, refetch } = useTestimonials();

  const handleDelete = useDeleteEntity({
    entityType: "testimonials",
    confirmMessage: "Tem certeza que deseja excluir este depoimento?",
    successMessage: "Depoimento excluído com sucesso",
    errorMessage: "Erro ao excluir depoimento",
    onDeleted: refetch,
  });

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Depoimentos</h1>
          <p className="text-muted-foreground">
            Gerenciar depoimentos de clientes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">Novo Depoimento</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {!testimonials || testimonials.length === 0 ? (
          <EmptyState message="Nenhum depoimento encontrado. Crie o primeiro depoimento!" />
        ) : (
          testimonials.map((testimonial: any) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {testimonial.clientPhoto && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={testimonial.clientPhoto}
                        alt={testimonial.clientPhotoAlt || testimonial.clientName}
                        fill
                        className="object-cover rounded-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">{testimonial.clientName}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{testimonial.text}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/testimonials/${testimonial.id}`}>Editar</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
