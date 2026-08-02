import { Badge } from "@/components/ui/badge";

export function VisaBadge({ sponsored }: { sponsored: boolean }) {
  if (!sponsored) return null;
  return (
    <Badge variant="warning" className="font-medium">
      Visa Sponsored
    </Badge>
  );
}