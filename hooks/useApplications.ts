"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  createApplication,
  getApplicationsByUser,
} from "@/lib/firestore/applications";
import type { Application } from "@/types";

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setApplications([]);
      return;
    }
    setLoading(true);
    try {
      const apps = await getApplicationsByUser(user.uid);
      setApplications(apps);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitApplication = useCallback(
    async (data: Omit<Application, "id" | "createdAt" | "updatedAt" | "status">) => {
      if (!user) return null;
      const id = await createApplication(data);
      await refresh();
      return id;
    },
    [user, refresh]
  );

  return { applications, loading, submitApplication, refresh };
}