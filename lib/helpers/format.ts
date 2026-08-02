import { formatDistanceToNow, format } from "date-fns";
import { EMPLOYMENT_TYPES } from "@/constants";
import type { EmploymentType } from "@/types";

export function formatSalary(
  min?: number,
  max?: number,
  currency = "USD"
): string {
  if (!min && !max) return "Not specified";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) {
    return `From ${formatter.format(min)}`;
  }
  return `Up to ${formatter.format(max ?? 0)}`;
}

export function formatDate(date: any): string {
  if (!date) return "";
  let d: Date;
  if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  } else if (typeof date?.toDate === "function") {
    d = date.toDate();
  } else if (date?.seconds) {
    d = new Date(date.seconds * 1000);
  } else {
    d = new Date(date);
  }
  return format(d, "MMM d, yyyy");
}

export function formatRelativeTime(date: any): string {
  if (!date) return "";
  let d: Date;
  if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  } else if (typeof date?.toDate === "function") {
    d = date.toDate();
  } else if (date?.seconds) {
    d = new Date(date.seconds * 1000);
  } else {
    d = new Date(date);
  }
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatEmploymentType(type: EmploymentType): string {
  return EMPLOYMENT_TYPES[type] ?? type;
}

export function formatLocation(job: {
  city: string;
  state: string;
  remote: boolean;
}): string {
  if (job.remote) return "Remote";
  return `${job.city}, ${job.state}`;
}