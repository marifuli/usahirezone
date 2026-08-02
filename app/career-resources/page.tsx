import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Career Resources & Advice",
  description: "Resume tips, interview preparation, visa guidance, and career advice for job seekers in the United States.",
  alternates: { canonical: "/career-resources" },
};

const ARTICLES = [
  {
    title: "How to Format Your US Resume for ATS",
    description: "Learn how Applicant Tracking Systems parse your resume and how to structure it to get past automated screeners.",
  },
  {
    title: "Understanding US Work Visas: H-1B, OPT, and STEM OPT",
    description: "A comprehensive guide for international students and workers navigating US work authorization.",
  },
  {
    title: "Ace Your Behavioral Interview",
    description: "Master the STAR method and prepare compelling answers to common behavioral questions.",
  },
  {
    title: "Salary Negotiation Strategies for Tech & Corporate Roles",
    description: "How to research benchmarks, communicate your value, and evaluate job offers effectively.",
  },
];

export default function CareerResourcesPage() {
  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Career Resources" }]} />
          <h1 className="text-3xl font-bold mt-4">Career Resources</h1>
          <p className="text-muted-foreground mt-2">
            Guides, tips, and advice to help you navigate your job search in the US.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((article) => (
            <Card key={article.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}