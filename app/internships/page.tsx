import type { Metadata } from "next";
import { JobList } from "@/features/jobs/components/JobList";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getInternships } from "@/lib/firestore/jobs";

export const metadata: Metadata = {
  title: "Internships in the USA",
  description: "Find internship opportunities across the United States. Summer internships, co-ops, and entry-level positions for students and recent graduates.",
  alternates: { canonical: "/internships" },
};

export default async function InternshipsPage() {
  let jobs: Awaited<ReturnType<typeof getInternships>> = [];
  try {
    jobs = await getInternships(50);
  } catch {
    jobs = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Internships" }]} />
          <h1 className="text-3xl font-bold mt-4">Internships in the USA</h1>
          <p className="text-muted-foreground mt-2">
            Launch your career with an internship at a top US company.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs} emptyMessage="No internships available right now." />
      </section>
    </>
  );
}