import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { JobList } from "@/features/jobs/components/JobList";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getStateBySlug } from "@/lib/firestore/states";
import { getCitiesByState } from "@/lib/firestore/cities";
import { getActiveJobs } from "@/lib/firestore/jobs";
import { formatSalary } from "@/lib/helpers/format";
import type { Job } from "@/types";

interface StatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) {
    return { title: "State Not Found" };
  }
  return {
    title: `Jobs in ${state.name}`,
    description: state.description ?? `Browse jobs in ${state.name}. Find employment opportunities, salary information, and top cities to work in ${state.name}.`,
    alternates: { canonical: `/state/${state.slug}` },
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { slug } = await params;
  const state = await getStateBySlug(slug);

  if (!state) {
    notFound();
  }

  let jobs: Job[] = [];
  let cities: Awaited<ReturnType<typeof getCitiesByState>> = [];
  try {
    const [jobResult, cityResult] = await Promise.all([
      getActiveJobs({ state: state.name }, 1),
      getCitiesByState(state.abbreviation, 20),
    ]);
    jobs = jobResult.items;
    cities = cityResult;
  } catch {
    jobs = [];
    cities = [];
  }

  const breadcrumbs = [
    { label: "States", href: "/states" },
    { label: state.name },
  ];

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-3xl font-bold mt-4">Jobs in {state.name}</h1>
          {state.description && (
            <p className="text-muted-foreground mt-2">{state.description}</p>
          )}
          {state.averageSalary && (
            <p className="mt-2 text-sm text-muted-foreground">
              Average salary: {formatSalary(state.averageSalary)}
            </p>
          )}
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />

        {cities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Cities in {state.name}</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/city/${city.slug}`}
                  className="rounded-full border px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Jobs in {state.name}</h2>
        <JobList jobs={jobs} emptyMessage={`No jobs available in ${state.name} right now.`} />
      </section>
    </>
  );
}