import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { SavedJob } from "@/types";

const SAVED_JOBS_COLLECTION = "saved_jobs";

function mapSavedJob(doc: QueryDocumentSnapshot<DocumentData>): SavedJob {
  return { id: doc.id, ...doc.data() } as SavedJob;
}

export async function saveJob(
  userId: string,
  job: { id: string; slug: string; title: string; companyName: string }
): Promise<string> {
  const docRef = await addDoc(collection(db, SAVED_JOBS_COLLECTION), {
    userId,
    jobId: job.id,
    jobSlug: job.slug,
    jobTitle: job.title,
    companyName: job.companyName,
    savedAt: new Date(),
  });
  return docRef.id;
}

export async function unsaveJob(userId: string, jobId: string): Promise<void> {
  const q = query(
    collection(db, SAVED_JOBS_COLLECTION),
    where("userId", "==", userId),
    where("jobId", "==", jobId)
  );
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, SAVED_JOBS_COLLECTION, docSnap.id));
  }
}

export async function getSavedJobsByUser(
  userId: string,
  count = 50
): Promise<SavedJob[]> {
  const q = query(
    collection(db, SAVED_JOBS_COLLECTION),
    where("userId", "==", userId),
    orderBy("savedAt", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapSavedJob);
}

export async function isJobSaved(userId: string, jobId: string): Promise<boolean> {
  const q = query(
    collection(db, SAVED_JOBS_COLLECTION),
    where("userId", "==", userId),
    where("jobId", "==", jobId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}