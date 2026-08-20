"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { useTransfers } from "@/hooks/useApi";

export default function EditTransfer() {
  const router = useRouter();
  const params = useParams();
  const { refetch } = useTransfers(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    vehicleType: "",
    active: true,
    imageUrl: "",
    imageAlt: "",
  });

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const response = await fetch(`/api/transfers/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Transfer não encontrado");
            router.push("/admin/transfers");
            return;
          }
          throw new Error("Failed to fetch transfer");
        }
        const transfer = await response.json();
        setFormData({
          name: transfer.name || "",
          description: transfer.description || "",
          price: transfer.price ? transfer.price.toString() : "",
          capacity: transfer.capacity ? transfer.capacity.toString() : "",
          vehicleType: transfer.vehicleType || "",
          active: transfer.active ?? true,
          imageUrl: transfer.imageUrl || "",
          imageAlt: transfer.imageAlt || "",
        });
      } catch (error) {
        toast.error("Erro ao carregar transfer");
        router.push("/admin/transfers");
      } finally {
        setLoading(false);
      }
    };

    fetchTransfer();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
      };

      const response = await fetch(`/api/transfers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update transfer");

      toast.success("Transfer atualizado com sucesso");
      refetch();
      router.push("/admin/transfers");
    } catch (error) {
      toast.error("Erro ao atualizar transfer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Transfer</h1>
        <p className="text-muted-foreground">Editar informações do transfer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Transfer</CardTitle>
          <CardDescription>Atualize os detalhes do transfer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Capacidade (pessoas)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: 4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Veículo</label>
              <input
                type="text"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: Sedan, SUV, Van"
              />
            </div>
            <ImageUpload
              label="Imagem do Veículo"
              currentImage={formData.imageUrl}
              onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Alt da Imagem</label>
              <input
                type="text"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Ativo</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/transfers")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
