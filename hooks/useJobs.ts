"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getActiveJobs,
  getLatestJobs,
  getRemoteJobs,
  getVisaSponsoredJobs,
  getInternships,
  getRelatedJobs,
  searchJobs,
} from "@/lib/firestore/jobs";
import type { Job, JobFilters } from "@/types";

export function useLatestJobs(count = 10) {
  return useQuery({
    queryKey: ["jobs", "latest", count],
    queryFn: () => getLatestJobs(count),
  });
}

export function useRemoteJobs(count = 20) {
  return useQuery({
    queryKey: ["jobs", "remote", count],
    queryFn: () => getRemoteJobs(count),
  });
}

export function useVisaSponsoredJobs(count = 20) {
  return useQuery({
    queryKey: ["jobs", "visa", count],
    queryFn: () => getVisaSponsoredJobs(count),
  });
}

export function useInternships(count = 20) {
  return useQuery({
    queryKey: ["jobs", "internships", count],
    queryFn: () => getInternships(count),
  });
}

export function useActiveJobs(filters: JobFilters = {}, page = 1) {
  return useQuery({
    queryKey: ["jobs", "active", filters, page],
    queryFn: () => getActiveJobs(filters, page),
  });
}

export function useSearchJobs(searchTerm: string, filters: JobFilters = {}, page = 1) {
  return useQuery({
    queryKey: ["jobs", "search", searchTerm, filters, page],
    queryFn: () => searchJobs(searchTerm, filters, page),
    enabled: searchTerm.length > 0,
  });
}

export function useRelatedJobs(job: Job | null, count = 5) {
  return useQuery({
    queryKey: ["jobs", "related", job?.id, count],
    queryFn: () => getRelatedJobs(job!, count),
    enabled: !!job,
  });
}