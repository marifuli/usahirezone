import type { Metadata } from "next";
import { JobList } from "@/features/jobs/components/JobList";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getVisaSponsoredJobs } from "@/lib/firestore/jobs";

export const metadata: Metadata = {
  title: "Visa Sponsored Jobs in the USA",
  description: "Find jobs in the USA that offer visa sponsorship. H-1B, OPT, and other visa sponsorship opportunities for international professionals.",
  alternates: { canonical: "/visa-sponsored-jobs" },
};

export default async function VisaSponsoredJobsPage() {
  let jobs: Awaited<ReturnType<typeof getVisaSponsoredJobs>> = [];
  try {
    jobs = await getVisaSponsoredJobs(50);
  } catch {
    jobs = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Visa Sponsored Jobs" }]} />
          <h1 className="text-3xl font-bold mt-4">Visa Sponsored Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Employers offering visa sponsorship for international talent.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs} emptyMessage="No visa-sponsored jobs available right now." />
      </section>
    </>
  );
}