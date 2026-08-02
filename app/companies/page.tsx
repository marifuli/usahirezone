import type { Metadata } from "next";
import { CompanyCard } from "@/features/companies/components/CompanyCard";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdBanner } from "@/features/ads/components/AdBanner";
import { getCompanies } from "@/lib/firestore/companies";

export const metadata: Metadata = {
  title: "Companies Hiring in the USA",
  description: "Browse companies hiring across the United States. Explore company profiles, open positions, and career opportunities.",
  alternates: { canonical: "/companies" },
};

export default async function CompaniesPage() {
  let companies: Awaited<ReturnType<typeof getCompanies>> = [];
  try {
    companies = await getCompanies(100);
  } catch {
    companies = [];
  }

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Companies" }]} />
          <h1 className="text-3xl font-bold mt-4">Companies Hiring</h1>
          <p className="text-muted-foreground mt-2">
            Explore companies with open positions across the United States.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <AdBanner slot="top" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
        {companies.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No companies available yet.
          </p>
        )}
      </section>
    </>
  );
}