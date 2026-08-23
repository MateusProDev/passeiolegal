"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useBanners } from "@/hooks/useApi";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorCard } from "@/components/ui/ErrorCard";

export default function BannersAdmin() {
  const { data: banners, loading, error, refetch } = useBanners();

  const handleDelete = useDeleteEntity({
    entityType: "banners",
    successMessage: "Banner deleted successfully",
    errorMessage: "Failed to delete banner",
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
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground">
            Gerenciar banners da página inicial
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/banners/new">Novo Banner</Link>
        </Button>
      </div>

      {error && <ErrorCard message={error.message} />}

      {!banners || banners.length === 0 ? (
        <EmptyState message="Nenhum banner encontrado. Crie o primeiro banner para começar." />
      ) : (
        <div className="grid gap-4">
          {banners.map((banner: any) => (
            <Card key={banner.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{banner.title}</CardTitle>
                    <CardDescription>{banner.subtitle}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/banners/${banner.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={banner.imageUrl}
                    alt={banner.imageAlt}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Botão:</span> {banner.buttonText}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Link:</span> {banner.buttonLink}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {banner.active ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog would go here */}
    </div>
  );
}
