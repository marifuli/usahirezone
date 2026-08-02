import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service and Conditions for using ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Terms of Service" }]} />
          <h1 className="text-3xl font-bold mt-4">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="container max-w-4xl py-12 prose max-w-none space-y-6">
        <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
        <p>
          By accessing or using {SITE_NAME}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
        </p>

        <h2 className="text-2xl font-bold">2. Job Listings and Aggregation</h2>
        <p>
          {SITE_NAME} aggregates job listings from various sources across the United States. While we strive to ensure accuracy, we do not warrant or guarantee the accuracy, completeness, or reliability of any job posting, salary estimate, or company information.
        </p>

        <h2 className="text-2xl font-bold">3. User Applications and Submissions</h2>
        <p>
          When you submit job applications or questionnaires through {SITE_NAME}, you represent that all information provided is accurate and truthful. File attachments (such as resumes or cover letters) are processed to facilitate your application submission.
        </p>

        <h2 className="text-2xl font-bold">4. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate our community standards or applicable laws.
        </p>

        <h2 className="text-2xl font-bold">5. Intellectual Property</h2>
        <p>
          All trademarks, company logos, and job posting content remain the property of their respective owners. Website branding, design, and code are owned by {SITE_NAME}.
        </p>

        <h2 className="text-2xl font-bold">6. Limitation of Liability</h2>
        <p>
          In no event shall {SITE_NAME} or its operators be liable for any damages arising out of the use or inability to use the materials or services on this website.
        </p>

        <h2 className="text-2xl font-bold">7. Contact Us</h2>
        <p>
          If you have any questions regarding these Terms, please contact us via our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.
        </p>
      </section>
    </>
  );
}