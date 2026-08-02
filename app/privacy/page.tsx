import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. Learn how we handle your data, personal information, and job application privacy.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} />
          <h1 className="text-3xl font-bold mt-4">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="container max-w-4xl py-12 prose max-w-none space-y-6">
        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when using {SITE_NAME}, such as when you create an account, search for jobs, or submit a job application or questionnaire. This may include your name, email address, job preferences, and application responses.
        </p>

        <h2 className="text-2xl font-bold">2. Resume and File Attachments</h2>
        <p>
          When you attach or upload a resume or cover letter as part of a job application, the file is used exclusively to facilitate your application submission to potential employers or hiring partners.
        </p>

        <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve our job aggregator service</li>
          <li>Process job applications and forward responses to employers or job aggregators</li>
          <li>Send authentication emails, status notifications, and updates</li>
          <li>Analyze search trends and optimize platform performance</li>
        </ul>

        <h2 className="text-2xl font-bold">4. Information Sharing and Disclosure</h2>
        <p>
          We do not sell your personal data to third parties. Information submitted as part of a job application is shared with the corresponding employer or sourcing partner as requested by you.
        </p>

        <h2 className="text-2xl font-bold">5. Cookies and Tracking</h2>
        <p>
          We use essential cookies and session storage to maintain authentication state, save user preferences, and support light/dark theme settings.
        </p>

        <h2 className="text-2xl font-bold">6. Data Security</h2>
        <p>
          We utilize industry-standard security measures provided by Google Firebase to protect your personal information against unauthorized access, alteration, or destruction.
        </p>

        <h2 className="text-2xl font-bold">7. Your Rights and Choices</h2>
        <p>
          You can access, update, or delete your account information at any time from your account <a href="/dashboard" className="text-primary hover:underline">Dashboard</a>.
        </p>

        <h2 className="text-2xl font-bold">8. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or data privacy at {SITE_NAME}, please contact us via our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.
        </p>
      </section>
    </>
  );
}