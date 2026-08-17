"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTours } from "@/hooks/useApi";

export default function ToursAdmin() {
  const { data: tours, loading, error } = useTours(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
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

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {!tours || tours.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum passeio encontrado. Crie o primeiro passeio para começar.
            </p>
          </CardContent>
        </Card>
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
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/tours/${tour.id}`, {
                            method: "DELETE",
                          });
                          if (!response.ok) throw new Error("Delete failed");
                          toast.success("Tour deleted successfully");
                          window.location.reload();
                        } catch (error) {
                          toast.error("Failed to delete tour");
                        }
                      }}
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
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Preço</p>
                      <p className="font-semibold">R$ {tour.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duração</p>
                      <p className="font-semibold">{tour.duration}</p>
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
