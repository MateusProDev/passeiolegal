"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { setCachedSettings } from "@/lib/settings-cache";
import type { SectionContentSettings, SectionSettings } from "@/types";

const defaultAboutSection = {
  title: "Sobre a Passeio Legal",
  description: "Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo.",
  stats: [
    { value: 10, label: "Anos de Experiência" },
    { value: 5000, label: "Clientes Satisfeitos" },
    { value: 100, label: "Destinos" },
  ],
};

const sectionOptions: { key: keyof SectionSettings; label: string; description: string }[] = [
  { key: "heroEnabled", label: "Banner principal", description: "Mostrar o banner principal na página inicial" },
  { key: "toursEnabled", label: "Passeios", description: "Mostrar a seção de passeios na página inicial" },
  { key: "transfersEnabled", label: "Transfers", description: "Mostrar a seção de transfers na página inicial" },
  { key: "aboutEnabled", label: "Sobre", description: "Mostrar a seção sobre a empresa na página inicial" },
  { key: "blogEnabled", label: "Blog", description: "Mostrar a seção do blog na página inicial" },
  { key: "testimonialsEnabled", label: "Depoimentos", description: "Mostrar os depoimentos na página inicial" },
  { key: "faqEnabled", label: "Perguntas frequentes", description: "Mostrar as perguntas frequentes na página inicial" },
];

const contentGroups: { label: string; options: { key: keyof SectionContentSettings; label: string }[] }[] = [
  {
    label: "Banner principal",
    options: [
      { key: "homeHeroTitle", label: "Título do banner" },
      { key: "homeHeroDescription", label: "Descrição do banner" },
      { key: "homeHeroButton", label: "Botão do banner" },
    ],
  },
  {
    label: "Passeios na página inicial",
    options: [
      { key: "homeToursTitle", label: "Título da seção" },
      { key: "homeToursDescription", label: "Descrição da seção" },
    ],
  },
  {
    label: "Transfers na página inicial",
    options: [
      { key: "homeTransfersTitle", label: "Título da seção" },
      { key: "homeTransfersDescription", label: "Descrição da seção" },
    ],
  },
  {
    label: "Sobre na página inicial",
    options: [
      { key: "homeAboutTitle", label: "Título" },
      { key: "homeAboutDescription", label: "Descrição" },
      { key: "homeAboutStats", label: "Estatísticas" },
    ],
  },
  {
    label: "Blog na página inicial",
    options: [
      { key: "homeBlogTitle", label: "Título da seção" },
      { key: "homeBlogDescription", label: "Descrição da seção" },
      { key: "homeBlogButton", label: "Botão para ver todos os artigos" },
    ],
  },
  {
    label: "Depoimentos na página inicial",
    options: [
      { key: "homeTestimonialsTitle", label: "Título da seção" },
      { key: "homeTestimonialsDescription", label: "Descrição da seção" },
    ],
  },
  {
    label: "Perguntas frequentes na página inicial",
    options: [
      { key: "homeFaqTitle", label: "Título da seção" },
      { key: "homeFaqDescription", label: "Descrição da seção" },
    ],
  },
  {
    label: "Página Sobre — apresentação",
    options: [
      { key: "aboutPageHeroTitle", label: "Título principal" },
      { key: "aboutPageHeroDescription", label: "Descrição principal" },
    ],
  },
  {
    label: "Página Sobre — nossa história",
    options: [
      { key: "aboutPageHistoryTitle", label: "Título" },
      { key: "aboutPageHistoryDescription", label: "Descrição" },
    ],
  },
  {
    label: "Página Sobre — missão e visão",
    options: [
      { key: "aboutPageMissionTitle", label: "Título da missão" },
      { key: "aboutPageMissionDescription", label: "Descrição da missão" },
      { key: "aboutPageVisionTitle", label: "Título da visão" },
      { key: "aboutPageVisionDescription", label: "Descrição da visão" },
    ],
  },
  {
    label: "Página Sobre — valores",
    options: [
      { key: "aboutPageValuesTitle", label: "Título" },
      { key: "aboutPageValuesDescription", label: "Lista de valores" },
    ],
  },
  {
    label: "Página Sobre — números",
    options: [
      { key: "aboutPageStatsTitle", label: "Título" },
      { key: "aboutPageStatsContent", label: "Estatísticas" },
    ],
  },
  {
    label: "Página Sobre — por que escolher a Passeio Legal",
    options: [
      { key: "aboutPageWhyTitle", label: "Título da seção" },
      { key: "aboutPageGuidesTitle", label: "Título: Guias experientes" },
      { key: "aboutPageGuidesDescription", label: "Descrição: Guias experientes" },
      { key: "aboutPageVehiclesTitle", label: "Título: Veículos confortáveis" },
      { key: "aboutPageVehiclesDescription", label: "Descrição: Veículos confortáveis" },
      { key: "aboutPageRoutesTitle", label: "Título: Roteiros exclusivos" },
      { key: "aboutPageRoutesDescription", label: "Descrição: Roteiros exclusivos" },
      { key: "aboutPageSupportTitle", label: "Título: Atendimento 24h" },
      { key: "aboutPageSupportDescription", label: "Descrição: Atendimento 24h" },
    ],
  },
  {
    label: "Página do Blog",
    options: [
      { key: "blogPageTitle", label: "Título principal" },
      { key: "blogPageDescription", label: "Descrição principal" },
    ],
  },
];

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      setCachedSettings(settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerenciar configurações gerais do site
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Configure a logo do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Logo do Cabeçalho</label>
            <ImageUpload
              currentImage={settings?.headerLogo}
              label=""
              compact
              onImageUpload={(url) =>
                setSettings({
                  ...settings,
                  headerLogo: url,
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto Alternativo da Logo</label>
            <Input
              placeholder="Passeio Legal"
              value={settings?.headerLogoAlt || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  headerLogoAlt: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Configure as informações básicas do seu site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título do Site</label>
            <Input
              placeholder="Passeio Legal"
              value={settings?.seoSettings?.siteTitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings?.seoSettings,
                    siteTitle: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              placeholder="Descrição do site"
              value={settings?.seoSettings?.siteDescription || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings?.seoSettings,
                    siteDescription: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
          <CardDescription>Informações de contato do seu negócio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="contato@example.com"
              value={settings?.contactInfo?.email || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: {
                    ...settings?.contactInfo,
                    email: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <Input
              placeholder="(11) 99999-9999"
              value={settings?.contactInfo?.phone || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: {
                    ...settings?.contactInfo,
                    phone: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">WhatsApp</label>
            <Input
              placeholder="(11) 99999-9999"
              value={settings?.contactInfo?.whatsapp || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: {
                    ...settings?.contactInfo,
                    whatsapp: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seções da página inicial</CardTitle>
          <CardDescription>Escolha quais seções serão exibidas no site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectionOptions.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label htmlFor={`section-${key}`} className="text-sm font-medium">{label}</label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <input
                id={`section-${key}`}
                type="checkbox"
                checked={settings?.sections?.[key] !== false}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    sections: {
                      ...settings?.sections,
                      [key]: event.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Títulos e descrições</CardTitle>
          <CardDescription>
            Ative ou desative individualmente cada título, descrição, botão e conteúdo exibido no site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {contentGroups.map((group) => (
            <fieldset key={group.label} className="space-y-3 border-b pb-4 last:border-0 last:pb-0">
              <legend className="text-sm font-semibold">{group.label}</legend>
              {group.options.map(({ key, label }) => {
                const enabled = settings?.sectionContent?.[key] !== false;
                return (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <label htmlFor={`content-${key}`} className="text-sm">{label}</label>
                    <label htmlFor={`content-${key}`} className="flex items-center gap-2 cursor-pointer">
                      <span className={`text-xs font-medium ${enabled ? "text-green-700" : "text-muted-foreground"}`}>
                        {enabled ? "Ativo — exibido" : "Desativado — oculto"}
                      </span>
                      <input
                        id={`content-${key}`}
                        type="checkbox"
                        checked={enabled}
                        aria-label={`${enabled ? "Desativar" : "Ativar"} ${label.toLowerCase()}`}
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            sectionContent: {
                              ...settings?.sectionContent,
                              [key]: event.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
                      />
                    </label>
                  </div>
                );
              })}
            </fieldset>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre a Passeio Legal</CardTitle>
          <CardDescription>Edite o texto e os números exibidos na seção sobre a empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              placeholder="Sobre a Passeio Legal"
              value={settings?.aboutSection?.title || defaultAboutSection.title}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings?.aboutSection, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Conte a história da empresa"
              value={settings?.aboutSection?.description || defaultAboutSection.description}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings?.aboutSection, description: e.target.value },
                })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => {
              const stat = settings?.aboutSection?.stats?.[index] || defaultAboutSection.stats[index];
              return (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">Estatística {index + 1}</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="10"
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                      stats[index] = { ...stats[index], value: Number(e.target.value) };
                      setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                    }}
                  />
                  <Input
                    placeholder="Anos de Experiência"
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                      stats[index] = { ...stats[index], label: e.target.value };
                      setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
        <Button variant="outline" onClick={fetchSettings}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
