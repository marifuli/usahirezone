import { Badge } from "@/components/ui/badge";

export function RemoteBadge({ remote }: { remote: boolean }) {
  if (!remote) return null;
  return (
    <Badge variant="secondary" className="font-medium">
      Remote
    </Badge>
  );
}