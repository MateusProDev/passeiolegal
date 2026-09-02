"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface DashboardStats {
  banners: number;
  tours: number;
  transfers: number;
  testimonials: number;
  blogPosts: number;
  faqItems: number;
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string | { seconds: number; nanoseconds: number };
}

const entityLabels: Record<string, string> = {
  banners: "banner",
  tours: "passeio",
  transfers: "transfer",
  testimonials: "depoimento",
  blog: "post do blog",
  faq: "item do FAQ",
  settings: "configurações",
};

const actionLabels: Record<string, string> = {
  created: "criado",
  updated: "atualizado",
  deleted: "excluído",
};

function formatActivityDate(timestamp: Activity["timestamp"]) {
  const date = typeof timestamp === "string"
    ? new Date(timestamp)
    : new Date(timestamp.seconds * 1000);
  return date.toLocaleString("pt-BR");
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    banners: 0,
    tours: 0,
    transfers: 0,
    testimonials: 0,
    blogPosts: 0,
    faqItems: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from API
        const endpoints = [
          { key: "banners", url: "/api/banners" },
          { key: "tours", url: "/api/tours" },
          { key: "transfers", url: "/api/transfers" },
          { key: "testimonials", url: "/api/testimonials" },
          { key: "blogPosts", url: "/api/blog?published=false" },
          { key: "faqItems", url: "/api/faq" },
        ];

        const responses = await Promise.all(
          endpoints.map(async (endpoint) => {
            const res = await fetch(endpoint.url);
            const data = await res.json();
            return {
              key: endpoint.key as keyof DashboardStats,
              value: Array.isArray(data) ? data.length : 0,
            };
          })
        );

        const results = responses.reduce<Partial<DashboardStats>>(
          (current, result) => ({ ...current, [result.key]: result.value }),
          {}
        );

        setStats((prev) => ({ ...prev, ...results }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    fetch("/api/activity")
      .then((response) => response.json())
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching activity:", error));
  }, []);

  const StatCard = ({ title, value, link }: { title: string; value: number; link: string }) => (
    <Link href={link}>
      <Card className="cursor-pointer border-gray-200 bg-white shadow-md hover:-translate-y-0.5 hover:shadow-xl transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Clique para gerenciar
          </p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Painel</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo da Passeio Legal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Banners"
          value={stats.banners}
          link="/admin/banners"
        />
        <StatCard
          title="Passeios"
          value={stats.tours}
          link="/admin/tours"
        />
        <StatCard
          title="Transfers"
          value={stats.transfers}
          link="/admin/transfers"
        />
        <StatCard
          title="Depoimentos"
          value={stats.testimonials}
          link="/admin/testimonials"
        />
        <StatCard
          title="Posts do Blog"
          value={stats.blogPosts}
          link="/admin/blog"
        />
        <StatCard
          title="Itens do FAQ"
          value={stats.faqItems}
          link="/admin/faq"
        />
      </div>

      {/* Quick Actions */}
        <Card className="border-gray-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">Ações rápidas</CardTitle>
          <CardDescription>Atalhos para as ações mais comuns</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/banners/new">Novo Banner</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/tours/new">Novo Passeio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/transfers/new">Novo Transfer</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/blog/new">Novo post do blog</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/testimonials/new">Novo Depoimento</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">Configurações</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-gray-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">Atividades recentes</CardTitle>
          <CardDescription>Atividades recentes do seu site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="flex items-start space-x-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nenhuma atividade ainda</p>
                  <p className="text-xs text-muted-foreground">Comece adicionando conteúdo</p>
                </div>
                <span className="text-xs text-muted-foreground">Agora</span>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {entityLabels[activity.entityType] || activity.entityType} {actionLabels[activity.action] || activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {activity.entityId}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatActivityDate(activity.timestamp)}
                  </span>
                </div>
              ))
                <Card className="border-gray-200 bg-white shadow-md">
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
