"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function TestimonialsAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Depoimentos</h1>
          <p className="text-muted-foreground">
            Gerenciar depoimentos de clientes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">Novo Depoimento</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Este módulo está em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
