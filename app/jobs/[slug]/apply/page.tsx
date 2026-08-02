"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ResumeUpload } from "@/features/applications/components/ResumeUpload";
import { QuestionnaireRenderer } from "@/features/applications/components/QuestionnaireRenderer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getJobBySlug } from "@/lib/firestore/jobs";
import { getQuestionnaireById } from "@/lib/firestore/questionnaires";
import { createApplication } from "@/lib/firestore/applications";
import { DEFAULT_VISA_QUESTIONS } from "@/constants";
import type { Job, Questionnaire, Question } from "@/types";

const defaultVisaQuestionnaire: Questionnaire = {
  id: "default-visa",
  name: "Visa & Eligibility Questions",
  questions: DEFAULT_VISA_QUESTIONS as Question[],
  active: true,
};

interface ApplyPageProps {
  params: Promise<{ slug: string }>;
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const foundJob = await getJobBySlug(slug);
        if (!foundJob) {
          setError("Job not found");
          return;
        }
        setJob(foundJob);

        if (foundJob.questionnaireId) {
          const q = await getQuestionnaireById(foundJob.questionnaireId);
          setQuestionnaire(q ?? defaultVisaQuestionnaire);
        } else {
          setQuestionnaire(defaultVisaQuestionnaire);
        }
      } catch {
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (authLoading || loading) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    );
  }


  if (error || !job) {
    return (
      <div className="container py-16 text-center">
        <p className="text-destructive">{error ?? "Job not found"}</p>
      </div>
    );
  }

  const handleSubmitQuestionnaire = async (
    answers: Record<string, string | string[] | number | boolean>
  ) => {
    if (!user && (!guestName || !guestEmail)) {
      setError("Please provide your full name and email address.");
      return;
    }

    if (!resumeUrl) {
      setError("Please upload your resume before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Split visa answers vs custom questionnaire answers
      const visaAnswers: Record<string, string | string[] | number | boolean> = {};
      const questionnaireAnswers: Record<string, string | string[] | number | boolean> = {};

      const visaQuestionIds = defaultVisaQuestionnaire.questions.map((q: Question) => q.id);

      for (const [key, value] of Object.entries(answers)) {
        if (visaQuestionIds.includes(key)) {
          visaAnswers[key] = value;
        } else {
          questionnaireAnswers[key] = value;
        }
      }

      const answersArray = Object.entries({ ...visaAnswers, ...questionnaireAnswers }).map(
        ([questionId, value]) => ({ questionId, value })
      );

      await createApplication({
        userId: user?.uid,
        applicantName: user?.displayName || guestName,
        applicantEmail: user?.email || guestEmail,
        jobId: job.id,
        jobSlug: job.slug,
        jobTitle: job.title,
        companyName: job.companyName,
        resumeUrl,
        coverLetter: coverLetter || undefined,
        answers: answersArray,
      });

      setSubmitted(true);
      if (user) {
        router.push("/dashboard?applied=true");
      }
    } catch {
      setError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: "Jobs", href: "/jobs" },
    { label: job.title, href: `/jobs/${job.slug}` },
    { label: "Apply" },
  ];

  return (
    <>
      <section className="bg-muted/50 border-b">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-3xl font-bold mt-4">Apply for {job.title}</h1>
          <p className="text-muted-foreground mt-2">{job.companyName}</p>
        </div>
      </section>

      <section className="container max-w-2xl py-8 space-y-8">
        {submitted && (
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Application Submitted Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Thank you for applying for <strong>{job.title}</strong> at <strong>{job.companyName}</strong>. Your application has been received.
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link href={`/jobs/${job.slug}`}>Back to Job</Link>
                </Button>
                <Button asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!submitted && (
          <>
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Applying as a guest. Already have an account?{" "}
                    <Link href={`/login?redirect=/jobs/${slug}/apply`} className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      placeholder="Jane Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email Address *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}
        {/* Resume upload */}
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeUpload value={resumeUrl} onUpload={setResumeUrl} />
          </CardContent>
        </Card>

        {/* Cover letter (optional) */}
        <Card>
          <CardHeader>
            <CardTitle>2. Cover Letter (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="coverLetter">Why are you a good fit for this role?</Label>
            <Textarea
              id="coverLetter"
              placeholder="Introduce yourself and highlight relevant experience..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Questionnaire */}
        {questionnaire && (
          <Card>
            <CardHeader>
              <CardTitle>3. Application Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionnaireRenderer
                questionnaire={questionnaire}
                onSubmit={handleSubmitQuestionnaire}
                submitting={submitting}
              />
            </CardContent>
          </Card>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}
      </section>
    </>
  );
}
