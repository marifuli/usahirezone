import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SalaryBadge } from "@/features/jobs/components/SalaryBadge";
import { RemoteBadge } from "@/features/jobs/components/RemoteBadge";
import { VisaBadge } from "@/features/jobs/components/VisaBadge";
import { formatRelativeTime, formatEmploymentType } from "@/lib/helpers/format";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              width={48}
              height={48}
              className="rounded-md object-contain"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="font-semibold text-lg hover:text-primary line-clamp-1"
                >
                  {job.title}
                </Link>
                <Link
                  href={`/company/${job.companyId}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {job.companyName}
                </Link>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <SalaryBadge min={job.salaryMin} max={job.salaryMax} currency={job.currency} />
                <div className="flex gap-1">
                  <RemoteBadge remote={job.remote} />
                  <VisaBadge sponsored={job.visaSponsorship} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.remote ? "Remote" : `${job.city}, ${job.state}`}
              </span>
              <Badge variant="outline">{formatEmploymentType(job.employmentType)}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatRelativeTime(job.postedAt)}
              </span>
            </div>

            {job.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {job.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}