import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { getStates } from "@/lib/firestore/states";

export const metadata: Metadata = {
  title: "Jobs by State in the USA",
  description: "Browse jobs by US state. Find employment opportunities in California, Texas, New York, Florida, and all 50 states.",
  alternates: { canonical: "/states" },
};

export default async function StatesPage() {
  let states: Awaited<ReturnType<typeof getStates>> = [];
  try {
    states = await getStates(60);
  } catch {
    states = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "States" }]} />
          <h1 className="text-3xl font-bold mt-4">Jobs by State</h1>
          <p className="text-muted-foreground mt-2">
            Explore job opportunities across all 50 US states.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {states.map((state) => (
            <Link
              key={state.id}
              href={`/state/${state.slug}`}
              className="rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold">{state.name}</h2>
              <p className="text-sm text-muted-foreground">{state.abbreviation}</p>
            </Link>
          ))}
        </div>
        {states.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No states available yet.
          </p>
        )}
      </section>
    </>
  );
}