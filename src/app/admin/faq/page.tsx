"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function FAQAdmin() {
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
