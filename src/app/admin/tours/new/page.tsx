"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function NewTour() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    active: true,
    mainImageUrl: "",
    mainImageAlt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to create tour");

      toast.success("Tour created successfully");
      router.push("/admin/tours");
    } catch (error) {
      toast.error("Failed to create tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Passeio</h1>
        <p className="text-muted-foreground">Criar um novo passeio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Passeio</CardTitle>
          <CardDescription>Preencha os detalhes do passeio</CardDescription>
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
              <label className="block text-sm font-medium mb-2">Duração</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: 4 horas"
              />
            </div>
            <ImageUpload
              label="Imagem Principal"
              currentImage={formData.mainImageUrl}
              onImageUpload={(url) => setFormData({ ...formData, mainImageUrl: url })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Alt da Imagem</label>
              <input
                type="text"
                value={formData.mainImageAlt}
                onChange={(e) => setFormData({ ...formData, mainImageAlt: e.target.value })}
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
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Passeio"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/tours")}
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
