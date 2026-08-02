import type { Metadata } from "next";
import { JobList } from "@/features/jobs/components/JobList";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getLatestJobs } from "@/lib/firestore/jobs";

export const metadata: Metadata = {
  title: "Latest Jobs in the USA",
  description: "Browse the newest job listings added to USAHireZone. Fresh opportunities posted daily across the United States.",
  alternates: { canonical: "/latest-jobs" },
};

export default async function LatestJobsPage() {
  let jobs: Awaited<ReturnType<typeof getLatestJobs>> = [];
//   try {
    jobs = await getLatestJobs(50);
//   } catch {
//     jobs = [];
//   }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Latest Jobs" }]} />
          <h1 className="text-3xl font-bold mt-4">Latest Jobs</h1>
          <p className="text-muted-foreground mt-2">
            The newest job opportunities added to our platform.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs} emptyMessage="No jobs available yet. Check back soon!" />
      </section>
    </>
  );
}