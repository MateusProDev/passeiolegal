"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTours } from "@/hooks/useApi";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorCard } from "@/components/ui/ErrorCard";

export default function ToursAdmin() {
  const { data: tours, loading, error, refetch } = useTours(false);

  const handleDelete = useDeleteEntity({
    entityType: "tours",
    successMessage: "Passeio deletado com sucesso",
    errorMessage: "Erro ao deletar passeio",
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
          <h1 className="text-3xl font-bold">Passeios</h1>
          <p className="text-muted-foreground">
            Gerenciar seus passeios e excursões
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tours/new">Novo Passeio</Link>
        </Button>
      </div>

      {error && <ErrorCard message={error.message} />}

      {!tours || tours.length === 0 ? (
        <EmptyState message="Nenhum passeio encontrado. Crie o primeiro passeio para começar." />
      ) : (
        <div className="grid gap-4">
          {tours.map((tour: any) => (
            <Card key={tour.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{tour.name}</CardTitle>
                    <CardDescription>{tour.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/tours/${tour.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(tour.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={tour.mainImageUrl}
                    alt={tour.mainImageAlt}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Duração</p>
                      <p className="font-semibold">{tour.duration || 'Consulte'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold">
                        {tour.active ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
