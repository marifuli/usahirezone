import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Building2, Globe, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { JobList } from "@/features/jobs/components/JobList";
import { JsonLd } from "@/features/seo/JsonLd";
import { companySchema, breadcrumbSchema } from "@/features/seo/schemas";
import { getCompanyBySlug } from "@/lib/firestore/companies";
import { getActiveJobs } from "@/lib/firestore/jobs";
import type { Job } from "@/types";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) {
    return { title: "Company Not Found" };
  }
  return {
    title: `${company.name} - Jobs and Careers`,
    description: `Explore open positions at ${company.name}. ${company.industry ? `${company.industry} company. ` : ""}Browse current job openings and career opportunities.`,
    alternates: { canonical: `/company/${company.slug}` },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  let jobs: Job[] = [];
  try {
    const result = await getActiveJobs({ companyId: company.id }, 1);
    jobs = result.items;
  } catch {
    jobs = [];
  }

  const breadcrumbs = [
    { label: "Companies", href: "/companies" },
    { label: company.name },
  ];

  return (
    <>
      <JsonLd data={[companySchema(company), breadcrumbSchema(breadcrumbs.map((b, i) => ({ name: b.label, url: b.href ?? `/company/${company.slug}` })))]} />

      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </section>

      <section className="container py-8">
        <div className="flex items-start gap-6 flex-col sm:flex-row">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              width={96}
              height={96}
              className="rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {company.industry && <span>{company.industry}</span>}
              {company.headquarters && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.headquarters}
                </span>
              )}
              {company.size && <span>{company.size}</span>}
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="h-4 w-4" />
                Visit website
              </a>
            )}
          </div>
        </div>

        {company.description && (
          <div className="mt-8 prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
            <p className="whitespace-pre-wrap">{company.description}</p>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Open Positions at {company.name}</h2>
          <JobList jobs={jobs} emptyMessage="No open positions at this company right now." />
        </div>

        <div className="mt-12">
          <AdBanner slot="inline" />
        </div>
      </section>
    </>
  );
}