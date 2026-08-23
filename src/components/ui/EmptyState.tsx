import { Card, CardContent } from "@/components/ui/Card";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
