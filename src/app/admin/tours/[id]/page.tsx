"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import ImageGalleryUpload from "@/components/ui/ImageGalleryUpload";
import { useTours } from "@/hooks/useApi";

export default function EditTour() {
  const router = useRouter();
  const params = useParams();
  const { refetch } = useTours(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    duration: "",
    active: true,
    featured: false,
    mainImageUrl: "",
    mainImageAlt: "",
    galleryImages: [],
    includesItems: "",
    excludesItems: "",
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Tour não encontrado");
            router.push("/admin/tours");
            return;
          }
          throw new Error("Failed to fetch tour");
        }
        const tour = await response.json();
        setFormData({
          name: tour.name || "",
          description: tour.description || "",
          longDescription: tour.longDescription || "",
          duration: tour.duration || "",
          active: tour.active ?? true,
          featured: tour.featured ?? false,
          mainImageUrl: tour.mainImageUrl || "",
          mainImageAlt: tour.mainImageAlt || "",
          galleryImages: Array.isArray(tour.galleryImages) ? tour.galleryImages.slice(0, 2) : [],
          includesItems: Array.isArray(tour.includesItems) ? tour.includesItems.join(", ") : "",
          excludesItems: Array.isArray(tour.excludesItems) ? tour.excludesItems.join(", ") : "",
        });
      } catch (error) {
        toast.error("Erro ao carregar tour");
        router.push("/admin/tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        includesItems: formData.includesItems
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        excludesItems: formData.excludesItems
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      };

      const response = await fetch(`/api/tours/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update tour");

      toast.success("Passeio atualizado com sucesso");
      refetch();
      router.push("/admin/tours");
    } catch (error) {
      toast.error("Erro ao atualizar passeio");
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
        <h1 className="text-3xl font-bold">Editar Passeio</h1>
        <p className="text-muted-foreground">Editar informações do passeio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Passeio</CardTitle>
          <CardDescription>Atualize os detalhes do passeio</CardDescription>
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
              <label className="block text-sm font-medium mb-2">Descrição Curta</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição Longa</label>
              <textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={6}
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
            <ImageGalleryUpload
              label="Imagens adicionais"
              images={formData.galleryImages}
              onImagesChange={(galleryImages) => setFormData({ ...formData, galleryImages })}
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
            <div>
              <label className="block text-sm font-medium mb-2">Itens Incluídos (separados por vírgula)</label>
              <textarea
                value={formData.includesItems}
                onChange={(e) => setFormData({ ...formData, includesItems: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Ex: Almoço, Transporte, Guia turístico"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Itens Excluídos (separados por vírgula)</label>
              <textarea
                value={formData.excludesItems}
                onChange={(e) => setFormData({ ...formData, excludesItems: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Ex: Bebidas alcoólicas, Gorjetas"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Ativo</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Destaque</label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alterações"}
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