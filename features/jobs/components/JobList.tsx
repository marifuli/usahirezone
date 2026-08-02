import { JobCard } from "@/features/jobs/components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SeedButton } from "@/components/seed-button";
import type { Job } from "@/types";

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  emptyMessage?: string;
}

export function JobList({ jobs, loading, emptyMessage = "No jobs found." }: JobListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-12 text-center space-y-2">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <SeedButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}