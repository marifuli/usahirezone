import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { getCities } from "@/lib/firestore/cities";

export const metadata: Metadata = {
  title: "Jobs by City in the USA",
  description: "Browse jobs by US city. Find employment opportunities in New York, Los Angeles, Chicago, Houston, and cities across America.",
  alternates: { canonical: "/cities" },
};

export default async function CitiesPage() {
  let cities: Awaited<ReturnType<typeof getCities>> = [];
  try {
    cities = await getCities(200);
  } catch {
    cities = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Cities" }]} />
          <h1 className="text-3xl font-bold mt-4">Jobs by City</h1>
          <p className="text-muted-foreground mt-2">
            Explore job opportunities in cities across the United States.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/city/${city.slug}`}
              className="rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold">{city.name}</h2>
              <p className="text-sm text-muted-foreground">{city.state}</p>
            </Link>
          ))}
        </div>
        {cities.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No cities available yet.
          </p>
        )}
      </section>
    </>
  );
}