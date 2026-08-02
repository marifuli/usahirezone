import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Application } from "@/types";

const APPLICATIONS_COLLECTION = "applications";

function mapApplication(doc: QueryDocumentSnapshot<DocumentData>): Application {
  return { id: doc.id, ...doc.data() } as Application;
}

export async function createApplication(
  data: Omit<Application, "id" | "createdAt" | "updatedAt" | "status">
): Promise<string> {
  const now = new Date();
  const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
    ...data,
    status: "SUBMITTED",
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const docRef = doc(db, APPLICATIONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Application;
}

export async function getApplicationsByUser(
  userId: string,
  count = 50
): Promise<Application[]> {
  const q = query(
    collection(db, APPLICATIONS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapApplication);
}

export async function getApplicationsByJob(
  jobId: string,
  count = 50
): Promise<Application[]> {
  const q = query(
    collection(db, APPLICATIONS_COLLECTION),
    where("jobId", "==", jobId),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapApplication);
}

export async function updateApplicationStatus(
  id: string,
  status: Application["status"]
): Promise<void> {
  const docRef = doc(db, APPLICATIONS_COLLECTION, id);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date(),
  });
}