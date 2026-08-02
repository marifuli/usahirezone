import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { getCategories } from "@/lib/firestore/categories";

export const metadata: Metadata = {
  title: "Job Categories in the USA",
  description: "Browse jobs by category. Explore opportunities in technology, healthcare, finance, marketing, and more across the United States.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories(100);
  } catch {
    categories = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Categories" }]} />
          <h1 className="text-3xl font-bold mt-4">Job Categories</h1>
          <p className="text-muted-foreground mt-2">
            Explore job opportunities by industry and category.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-lg">{category.name}</h2>
              {category.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No categories available yet.
          </p>
        )}
      </section>
    </>
  );
}