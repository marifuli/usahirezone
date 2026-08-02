"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        router.refresh();
      } else {
        setMessage("Failed to seed database.");
      }
    } catch {
      setMessage("Error seeding database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <Button onClick={handleSeed} disabled={loading} variant="outline" size="sm">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Seeding 100 Jobs...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Seed 100 Sample USA Jobs
          </>
        )}
      </Button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}