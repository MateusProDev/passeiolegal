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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    banners: 0,
    tours: 0,
    transfers: 0,
    testimonials: 0,
    blogPosts: 0,
    faqItems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from API
        const endpoints = [
          { key: "banners", url: "/api/banners" },
          { key: "tours", url: "/api/tours" },
          { key: "transfers", url: "/api/transfers" },
        ];

        const results: Partial<DashboardStats> = {};
        for (const endpoint of endpoints) {
          const res = await fetch(endpoint.url);
          const data = await res.json();
          results[endpoint.key as keyof DashboardStats] = Array.isArray(data)
            ? data.length
            : 0;
        }

        setStats((prev) => ({ ...prev, ...results }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, link }: { title: string; value: number; link: string }) => (
    <Link href={link}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Click to manage
          </p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
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
          title="Blog Posts"
          value={stats.blogPosts}
          link="/admin/blog"
        />
        <StatCard
          title="FAQ Items"
          value={stats.faqItems}
          link="/admin/faq"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
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
            <Link href="/admin/blog/new">Novo Blog Post</Link>
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Atividades recentes do seu site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nenhuma atividade ainda</p>
                <p className="text-xs text-muted-foreground">
                  Comece adicionando conteúdo
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Agora</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
