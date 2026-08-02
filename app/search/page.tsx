import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { FilterSidebar } from "@/features/search/components/FilterSidebar";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { searchJobs } from "@/lib/firestore/jobs";
import type { Job, JobFilters, EmploymentType } from "@/types";
import { JobList } from "@/features/jobs/components/JobList";

export const metadata: Metadata = {
  title: "Search Jobs in the USA",
  description: "Search jobs in the United States by keyword, location, remote work, visa sponsorship, employment type, and salary.",
  alternates: { canonical: "/search" },
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = parseInt(params.page ?? "1", 10) || 1;

  const filters: JobFilters = {
    category: params.category,
    state: params.state,
    city: params.city,
    remote: params.remote === "true" ? true : undefined,
    visaSponsorship: params.visa === "true" ? true : undefined,
    employmentType: params.employmentType as EmploymentType | undefined,
  };

  let jobs: Job[] = [];
  let total = 0;
  try {
    const result = await searchJobs(q, filters, page);
    jobs = result.items;
    total = result.items.length;
  } catch {
    jobs = [];
    total = 0;
  }

  const hasFilters = Object.values(params).some((v) => !!v);

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Search" }]} />
          <h1 className="text-3xl font-bold mt-4">
            {q ? `Results for "${q}"` : "Search Jobs"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {hasFilters ? `${total} jobs found` : "Use the filters to narrow down your search."}
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="space-y-4"><div className="h-40 w-full animate-pulse bg-muted rounded-lg" /></div>}>
              <FilterSidebar />
            </Suspense>
          </div>

          <div className="lg:col-span-3">
            <AdBanner slot="top" className="mb-8" />
            <JobList
              jobs={jobs}
              emptyMessage={
                hasFilters
                  ? "No jobs match your search criteria. Try adjusting your filters."
                  : "Enter a search term to find jobs."
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}