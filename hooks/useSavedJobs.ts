"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  saveJob as saveJobToFirestore,
  unsaveJob as unsaveJobFromFirestore,
  getSavedJobsByUser,
  isJobSaved,
} from "@/lib/firestore/savedJobs";
import type { SavedJob } from "@/types";

export function useSavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedJobs([]);
      return;
    }
    setLoading(true);
    try {
      const jobs = await getSavedJobsByUser(user.uid);
      setSavedJobs(jobs);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveJob = useCallback(
    async (job: { id: string; slug: string; title: string; companyName: string }) => {
      if (!user) return;
      await saveJobToFirestore(user.uid, job);
      await refresh();
    },
    [user, refresh]
  );

  const unsaveJob = useCallback(
    async (jobId: string) => {
      if (!user) return;
      await unsaveJobFromFirestore(user.uid, jobId);
      await refresh();
    },
    [user, refresh]
  );

  const checkSaved = useCallback(
    async (jobId: string): Promise<boolean> => {
      if (!user) return false;
      return isJobSaved(user.uid, jobId);
    },
    [user]
  );

  return { savedJobs, loading, saveJob, unsaveJob, checkSaved, refresh };
}