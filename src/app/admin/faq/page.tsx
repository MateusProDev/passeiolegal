"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useFAQs } from "@/hooks/useApi";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function FAQAdmin() {
  const { data: faqs, loading, refetch } = useFAQs();

  const handleDelete = useDeleteEntity({
    entityType: "faq",
    confirmMessage: "Tem certeza que deseja excluir esta pergunta?",
    successMessage: "Pergunta excluída com sucesso",
    errorMessage: "Erro ao excluir pergunta",
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
          <h1 className="text-3xl font-bold">FAQ</h1>
          <p className="text-muted-foreground">
            Gerenciar perguntas frequentes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/faq/new">Nova Pergunta</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {!faqs || faqs.length === 0 ? (
          <EmptyState message="Nenhuma pergunta encontrada. Crie a primeira pergunta!" />
        ) : (
          faqs.map((faq: any) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/faq/${faq.id}`}>Editar</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      Excluir
                    </Button>
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
