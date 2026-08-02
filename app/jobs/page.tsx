import type { Metadata } from "next";
import { JobList } from "@/features/jobs/components/JobList";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getActiveJobs } from "@/lib/firestore/jobs";

export const metadata: Metadata = {
  title: "Browse Jobs in the USA",
  description: "Browse thousands of job listings across the United States. Filter by location, remote work, salary, employment type, and more.",
  alternates: { canonical: "/jobs" },
};

interface JobsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10) || 1;
  let jobs = { items: [], hasMore: false, page, pageSize: 20 } as Awaited<ReturnType<typeof getActiveJobs>>;
  
  try {
    jobs = await getActiveJobs({}, page);
  } catch {
    // Fallback to empty
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Browse Jobs" }]} />
          <h1 className="text-3xl font-bold mt-4">Browse Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Explore all available job opportunities across the United States.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs.items} emptyMessage="No jobs found. Please check back later." />
        
        {jobs.hasMore && (
          <Pagination className="mt-8">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/jobs?page=${page - 1}`} />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href={`/jobs?page=${page}`} isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href={`/jobs?page=${page + 1}`} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </>
  );
}