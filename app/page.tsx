import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SearchBar } from "@/features/search/components/SearchBar";
import { JobList } from "@/features/jobs/components/JobList";
import { Skeleton } from "@/components/ui/skeleton";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";
import { JsonLd } from "@/features/seo/JsonLd";
import { getLatestJobs } from "@/lib/firestore/jobs";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Find Jobs in the United States`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

async function LatestJobsSection() {
  let jobs: Awaited<ReturnType<typeof getLatestJobs>> = [];
  try {
    jobs = await getLatestJobs(10);
  } catch {
    jobs = [];
  }
  return <JobList jobs={jobs} />;
}

const popularCategories = [
  "Software Engineering",
  "Healthcare",
  "Finance",
  "Marketing",
  "Data Science",
  "Sales",
  "Design",
  "Customer Support",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: "https://usahirezone.com",
      }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find Your Next Job in the USA
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of jobs across all 50 states. Search by role, location,
            remote work, and visa sponsorship.
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {popularCategories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase().replace(/ /g, "-")}`}
                className="rounded-full border px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Jobs</h2>
          <Link href="/latest-jobs" className="text-primary hover:underline">
            View all →
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          }
        >
          <LatestJobsSection />
        </Suspense>
      </section>

      <section className="container pb-12">
        <AdBanner slot="inline" />
      </section>
    </>
  );
}