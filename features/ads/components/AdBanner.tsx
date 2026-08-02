import { cn } from "@/lib/helpers/utils";

interface AdBannerProps {
  slot: "top" | "sidebar" | "inline" | "footer";
  className?: string;
}

const AD_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

const slotStyles: Record<AdBannerProps["slot"], string> = {
  top: "h-24 w-full",
  sidebar: "h-64 w-full",
  inline: "h-32 w-full",
  footer: "h-20 w-full",
};

export function AdBanner({ slot, className }: AdBannerProps) {
  if (!AD_ENABLED) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border border-dashed bg-muted/50 text-sm text-muted-foreground",
        slotStyles[slot],
        className
      )}
      aria-label="Advertisement"
    >
      Advertisement
    </div>
  );
}