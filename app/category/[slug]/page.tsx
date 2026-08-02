import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { JobList } from "@/features/jobs/components/JobList";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getCategoryBySlug } from "@/lib/firestore/categories";
import { getActiveJobs } from "@/lib/firestore/jobs";
import type { Job } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  return {
    title: `${category.name} Jobs in the USA`,
    description: category.description ?? `Browse ${category.name} jobs across the United States. Find your next ${category.name.toLowerCase()} career opportunity.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  let jobs: Job[] = [];
  try {
    const result = await getActiveJobs({ category: category.id }, 1);
    jobs = result.items;
  } catch {
    jobs = [];
  }

  const breadcrumbs = [
    { label: "Categories", href: "/categories" },
    { label: category.name },
  ];

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-3xl font-bold mt-4">{category.name} Jobs</h1>
          {category.description && (
            <p className="text-muted-foreground mt-2">{category.description}</p>
          )}
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <JobList jobs={jobs} emptyMessage={`No ${category.name.toLowerCase()} jobs available right now.`} />
      </section>
    </>
  );
}