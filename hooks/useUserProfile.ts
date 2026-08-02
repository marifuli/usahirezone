"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/firestore/users";
import type { UserProfile } from "@/types";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const data = await getUserProfile(user.uid);
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) return;
      await updateUserProfile(user.uid, data);
      await refresh();
    },
    [user, refresh]
  );

  return { profile, loading, updateProfile, refresh };
}