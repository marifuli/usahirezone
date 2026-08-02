import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { UserProfile } from "@/types";

const USERS_COLLECTION = "users";

export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const now = new Date();
  const docRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(docRef, {
    ...data,
    uid,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}