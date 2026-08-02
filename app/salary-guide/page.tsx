import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "US Salary Guide 2026",
  description: "Explore salary benchmarks and compensation trends across tech, healthcare, finance, and other industries in the United States.",
  alternates: { canonical: "/salary-guide" },
};

const SALARY_BENCHMARKS = [
  { title: "Software Engineer", range: "$90,000 - $180,000", avg: "$130,000" },
  { title: "Data Scientist", range: "$95,000 - $175,000", avg: "$135,000" },
  { title: "Product Manager", range: "$100,000 - $190,000", avg: "$140,000" },
  { title: "UX Designer", range: "$75,000 - $150,000", avg: "$110,000" },
  { title: "Registered Nurse", range: "$65,000 - $110,000", avg: "$82,000" },
  { title: "Financial Analyst", range: "$70,000 - $130,000", avg: "$92,000" },
  { title: "Marketing Manager", range: "$70,000 - $145,000", avg: "$105,000" },
  { title: "DevOps Engineer", range: "$100,000 - $185,000", avg: "$142,000" },
];

export default function SalaryGuidePage() {
  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Salary Guide" }]} />
          <h1 className="text-3xl font-bold mt-4">US Salary Guide 2026</h1>
          <p className="text-muted-foreground mt-2">
            Average compensation benchmarks for popular roles in the United States.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SALARY_BENCHMARKS.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground">Average: <span className="font-semibold text-foreground">{item.avg}</span></p>
                <p className="text-muted-foreground">Range: <span className="font-semibold text-foreground">{item.range}</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}