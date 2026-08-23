import { Card, CardContent } from "@/components/ui/Card";

interface ErrorCardProps {
  message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <Card className="border-destructive bg-destructive/10">
      <CardContent className="pt-6">
        <p className="text-destructive">{message}</p>
      </CardContent>
    </Card>
  );
}
