import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { JobList } from "@/features/jobs/components/JobList";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getCityBySlug } from "@/lib/firestore/cities";
import { getActiveJobs } from "@/lib/firestore/jobs";
import { formatSalary } from "@/lib/helpers/format";
import type { Job } from "@/types";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) {
    return { title: "City Not Found" };
  }
  return {
    title: `Jobs in ${city.name}, ${city.state}`,
    description: city.description ?? `Browse jobs in ${city.name}, ${city.state}. Find employment opportunities, salary information, and career resources.`,
    alternates: { canonical: `/city/${city.slug}` },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  let jobs: Job[] = [];
  try {
    const result = await getActiveJobs({ city: city.name }, 1);
    jobs = result.items;
  } catch {
    jobs = [];
  }

  const breadcrumbs = [
    { label: "Cities", href: "/cities" },
    { label: city.name },
  ];

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-3xl font-bold mt-4">Jobs in {city.name}, {city.state}</h1>
          {city.description && (
            <p className="text-muted-foreground mt-2">{city.description}</p>
          )}
          {city.averageSalary && (
            <p className="mt-2 text-sm text-muted-foreground">
              Average salary: {formatSalary(city.averageSalary)}
            </p>
          )}
          <Link
            href={`/state/${city.stateAbbreviation.toLowerCase()}`}
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            View all jobs in {city.state} →
          </Link>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs} emptyMessage={`No jobs available in ${city.name} right now.`} />
      </section>
    </>
  );
}