"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EMPLOYMENT_TYPES } from "@/constants";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  const remote = searchParams.get("remote");
  const visa = searchParams.get("visa");
  const employmentType = searchParams.get("employmentType");

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Job Type</h3>
        <div className="space-y-2">
          {Object.entries(EMPLOYMENT_TYPES).map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`type-${value}`}
                checked={employmentType === value}
                onCheckedChange={(checked) =>
                  updateFilter("employmentType", checked ? value : null)
                }
              />
              <Label htmlFor={`type-${value}`}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Work Type</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remote"
              checked={remote === "true"}
              onCheckedChange={(checked) =>
                updateFilter("remote", checked ? "true" : null)
              }
            />
            <Label htmlFor="remote">Remote</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Visa Sponsorship</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="visa"
              checked={visa === "true"}
              onCheckedChange={(checked) =>
                updateFilter("visa", checked ? "true" : null)
              }
            />
            <Label htmlFor="visa">Visa Sponsored</Label>
          </div>
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.push("/search")}
      >
        Clear All Filters
      </Button>
    </aside>
  );
}