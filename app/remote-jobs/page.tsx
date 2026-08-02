import type { Metadata } from "next";
import { JobList } from "@/features/jobs/components/JobList";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getRemoteJobs } from "@/lib/firestore/jobs";

export const metadata: Metadata = {
  title: "Remote Jobs in the USA",
  description: "Find remote jobs across the United States. Work from anywhere with our curated list of fully remote positions.",
  alternates: { canonical: "/remote-jobs" },
};

export default async function RemoteJobsPage() {
  let jobs: Awaited<ReturnType<typeof getRemoteJobs>> = [];
  try {
    jobs = await getRemoteJobs(50);
  } catch {
    jobs = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Remote Jobs" }]} />
          <h1 className="text-3xl font-bold mt-4">Remote Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Work from anywhere in the US with these fully remote opportunities.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs} emptyMessage="No remote jobs available right now." />
      </section>
    </>
  );
}