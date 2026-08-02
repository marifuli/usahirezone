import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Clock, Briefcase, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { SalaryBadge } from "@/features/jobs/components/SalaryBadge";
import { RemoteBadge } from "@/features/jobs/components/RemoteBadge";
import { VisaBadge } from "@/features/jobs/components/VisaBadge";
import { JsonLd } from "@/features/seo/JsonLd";
import { jobPostingSchema, breadcrumbSchema } from "@/features/seo/schemas";
import { getJobBySlug, getRelatedJobs } from "@/lib/firestore/jobs";
import { JobList } from "@/features/jobs/components/JobList";
import { formatDate, formatSalary, formatEmploymentType } from "@/lib/helpers/format";
import { SITE_NAME } from "@/constants";
import type { Job } from "@/types";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) {
    return { title: "Job Not Found" };
  }
  return {
    title: `${job.title} at ${job.companyName}`,
    description: `${job.title} job at ${job.companyName}. ${job.remote ? "Remote" : `${job.city}, ${job.state}`}. ${formatSalary(job.salaryMin, job.salaryMax, job.currency)}${job.visaSponsorship ? ". Visa sponsorship available." : ""}`,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: {
      title: `${job.title} at ${job.companyName}`,
      description: `${job.remote ? "Remote" : `${job.city}, ${job.state}`} position at ${job.companyName}. Apply now on ${SITE_NAME}.`,
      type: "article",
      publishedTime: String(job.postedAt),
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  let relatedJobs: Job[] = [];
  try {
    relatedJobs = await getRelatedJobs(job, 5);
  } catch {
    relatedJobs = [];
  }

  const breadcrumbs = [
    { label: "Jobs", href: "/jobs" },
    { label: job.title },
  ];

  return (
    <>
      <JsonLd data={[jobPostingSchema(job), breadcrumbSchema([...breadcrumbs.map((b, i) => ({ name: b.label, url: b.href ?? `/jobs/${job.slug}` }))])]} />

      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-6 flex-col sm:flex-row">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={`${job.companyName} logo`}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <Link href={`/company/${job.companyId}`} className="text-lg text-primary hover:underline">
                  {job.companyName}
                </Link>
                <div className="mt-2 flex flex-wrap gap-2">
                  <SalaryBadge min={job.salaryMin} max={job.salaryMax} currency={job.currency} />
                  <RemoteBadge remote={job.remote} />
                  <VisaBadge sponsored={job.visaSponsorship} />
                </div>
              </div>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="mt-1 font-medium">
                  {job.remote ? "Remote" : `${job.city}, ${job.state}`}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  Type
                </div>
                <p className="mt-1 font-medium">{formatEmploymentType(job.employmentType)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Posted
                </div>
                <p className="mt-1 font-medium">{formatDate(job.postedAt)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none space-y-6">
              <h2 className="text-2xl font-bold">Job Description</h2>
              <p className="whitespace-pre-wrap">{job.description}</p>

              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="list-disc pl-6 space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold">Benefits</h2>
              <ul className="list-disc pl-6 space-y-2">
                {job.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>

              {job.skills?.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Source */}
            {job.source && (
              <p className="text-sm text-muted-foreground">
                Source: {job.source}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="font-semibold">Ready to Apply?</h2>
              <Button asChild size="lg" className="w-full">
                <Link href={`/jobs/${job.slug}/apply`}>Apply Now</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Applications are processed securely through the company's preferred channel.
              </p>
            </div>

            {job.sourceUrl && (
              <div className="rounded-lg border p-6">
                <Button asChild variant="outline" className="w-full">
                  <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                    Apply on {job.source || "Company Site"}
                  </a>
                </Button>
              </div>
            )}

            <AdBanner slot="sidebar" />
          </div>
        </div>

        {/* Related jobs */}
        {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
            <JobList jobs={relatedJobs} />
          </div>
        )}
      </section>
    </>
  );
}