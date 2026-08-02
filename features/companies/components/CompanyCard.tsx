import Link from "next/link";
import Image from "next/image";
import { Building2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              width={48}
              height={48}
              className="rounded-md object-contain"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={`/company/${company.slug}`}
              className="font-semibold hover:text-primary"
            >
              {company.name}
            </Link>
            {company.industry && (
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            )}
          </div>
        </div>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Globe className="h-4 w-4" />
            Visit website
          </a>
        )}
      </CardContent>
    </Card>
  );
}