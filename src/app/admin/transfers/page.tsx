"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTransfers } from "@/hooks/useApi";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorCard } from "@/components/ui/ErrorCard";

export default function TransfersAdmin() {
  const { data: transfers, loading, error, refetch } = useTransfers(false);

  const handleDelete = useDeleteEntity({
    entityType: "transfers",
    successMessage: "Transfer deletado com sucesso",
    errorMessage: "Erro ao deletar transfer",
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
          <h1 className="text-3xl font-bold">Transfers</h1>
          <p className="text-muted-foreground">
            Gerenciar seus serviços de transfer
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/transfers/new">Novo Transfer</Link>
        </Button>
      </div>

      {error && <ErrorCard message={error.message} />}

      {!transfers || transfers.length === 0 ? (
        <EmptyState message="Nenhum transfer encontrado. Crie o primeiro transfer para começar." />
      ) : (
        <div className="grid gap-4">
          {transfers.map((transfer: any) => (
            <Card key={transfer.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{transfer.name}</CardTitle>
                    <CardDescription>{transfer.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/transfers/${transfer.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(transfer.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={transfer.imageUrl}
                    alt={transfer.imageAlt}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Veículo</p>
                      <p className="font-semibold">{transfer.vehicleType || 'Consulte'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Capacidade</p>
                      <p className="font-semibold">{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold">
                        {transfer.active ? "Ativo" : "Inativo"}
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
