import { Badge } from "@/components/ui/badge";
import { formatSalary } from "@/lib/helpers/format";

interface SalaryBadgeProps {
  min?: number;
  max?: number;
  currency?: string;
}

export function SalaryBadge({ min, max, currency = "USD" }: SalaryBadgeProps) {
  if (!min && !max) return null;
  return (
    <Badge variant="success" className="font-medium">
      {formatSalary(min, max, currency)}
    </Badge>
  );
}