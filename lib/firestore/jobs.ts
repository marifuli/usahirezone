import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { seedJobsIfEmpty } from "@/lib/firestore/seed";
import type { Job, JobFilters, PaginatedResult } from "@/types";

const JOBS_COLLECTION = "jobs";
const PAGE_SIZE = 20;

function mapJob(doc: QueryDocumentSnapshot<DocumentData>): Job {
  const data = doc.data();
  let postedAt = data.postedAt;
  if (typeof postedAt?.toDate === "function") {
    postedAt = postedAt.toDate().toISOString();
  } else if (postedAt?.seconds) {
    postedAt = new Date(postedAt.seconds * 1000).toISOString();
  } else if (postedAt instanceof Date) {
    postedAt = postedAt.toISOString();
  }

  let expiresAt = data.expiresAt;
  if (typeof expiresAt?.toDate === "function") {
    expiresAt = expiresAt.toDate().toISOString();
  } else if (expiresAt?.seconds) {
    expiresAt = new Date(expiresAt.seconds * 1000).toISOString();
  } else if (expiresAt instanceof Date) {
    expiresAt = expiresAt.toISOString();
  }

  return {
    id: doc.id,
    ...data,
    postedAt,
    expiresAt,
  } as Job;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const docRef = doc(db, JOBS_COLLECTION, slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Job;
}

export async function getActiveJobs(
  filters: JobFilters = {},
  page = 1
): Promise<PaginatedResult<Job>> {
  await seedJobsIfEmpty().catch(() => {});

  try {
    const constraints: QueryConstraint[] = [where("active", "==", true)];

    if (filters.category) constraints.push(where("category", "==", filters.category));
    if (filters.state) constraints.push(where("state", "==", filters.state));
    if (filters.city) constraints.push(where("city", "==", filters.city));
    if (filters.remote !== undefined) constraints.push(where("remote", "==", filters.remote));
    if (filters.visaSponsorship !== undefined) constraints.push(where("visaSponsorship", "==", filters.visaSponsorship));
    if (filters.employmentType) constraints.push(where("employmentType", "==", filters.employmentType));
    if (filters.companyId) constraints.push(where("companyId", "==", filters.companyId));

    constraints.push(orderBy("postedAt", "desc"));
    constraints.push(limit(PAGE_SIZE));

    const q = query(collection(db, JOBS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const jobs = snapshot.docs.map(mapJob);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return {
      items: jobs,
      lastVisible,
      hasMore: snapshot.docs.length === PAGE_SIZE,
      page,
      pageSize: PAGE_SIZE,
    };
  } catch (err: any) {
    // If composite index is missing, fall back to fetching and sorting in memory
    if (err?.code === "failed-precondition") {
      console.warn("Firestore index missing. Falling back to in-memory filtering. Create index in Firebase Console.");
      const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
      let jobs = snapshot.docs.map(mapJob).filter((j) => j.active);

      if (filters.category) jobs = jobs.filter((j) => j.category === filters.category);
      if (filters.state) jobs = jobs.filter((j) => j.state === filters.state);
      if (filters.city) jobs = jobs.filter((j) => j.city === filters.city);
      if (filters.remote !== undefined) jobs = jobs.filter((j) => j.remote === filters.remote);
      if (filters.visaSponsorship !== undefined) jobs = jobs.filter((j) => j.visaSponsorship === filters.visaSponsorship);
      if (filters.employmentType) jobs = jobs.filter((j) => j.employmentType === filters.employmentType);
      if (filters.companyId) jobs = jobs.filter((j) => j.companyId === filters.companyId);

      jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      const paginated = jobs.slice(0, PAGE_SIZE);

      return {
        items: paginated,
        lastVisible: undefined,
        hasMore: jobs.length > PAGE_SIZE,
        page,
        pageSize: PAGE_SIZE,
      };
    }
    throw err;
  }
}

export async function getLatestJobs(count = 10): Promise<Job[]> {
  await seedJobsIfEmpty().catch(() => {});
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("active", "==", true),
      orderBy("postedAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapJob);
  } catch (err: any) {
    if (err?.code === "failed-precondition") {
      console.warn("Firestore index missing for getLatestJobs. Falling back to in-memory sort.");
      const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
      const jobs = snapshot.docs.map(mapJob).filter((j) => j.active);
      jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      return jobs.slice(0, count);
    }
    throw err;
  }
}

export async function getRemoteJobs(count = 20): Promise<Job[]> {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("active", "==", true),
      where("remote", "==", true),
      orderBy("postedAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapJob);
  } catch (err: any) {
    if (err?.code === "failed-precondition") {
      const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
      const jobs = snapshot.docs.map(mapJob).filter((j) => j.active && j.remote);
      jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      return jobs.slice(0, count);
    }
    throw err;
  }
}

export async function getVisaSponsoredJobs(count = 20): Promise<Job[]> {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("active", "==", true),
      where("visaSponsorship", "==", true),
      orderBy("postedAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapJob);
  } catch (err: any) {
    if (err?.code === "failed-precondition") {
      const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
      const jobs = snapshot.docs.map(mapJob).filter((j) => j.active && j.visaSponsorship);
      jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      return jobs.slice(0, count);
    }
    throw err;
  }
}

export async function getInternships(count = 20): Promise<Job[]> {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("active", "==", true),
      where("employmentType", "==", "INTERNSHIP"),
      orderBy("postedAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapJob);
  } catch (err: any) {
    if (err?.code === "failed-precondition") {
      const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
      const jobs = snapshot.docs.map(mapJob).filter((j) => j.active && j.employmentType === "INTERNSHIP");
      jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      return jobs.slice(0, count);
    }
    throw err;
  }
}

export async function getRelatedJobs(
  job: Job,
  count = 5
): Promise<Job[]> {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where("active", "==", true),
    where("category", "==", job.category),
    orderBy("postedAt", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(mapJob)
    .filter((related) => related.id !== job.id)
    .slice(0, count);
}

export async function searchJobs(
  searchTerm: string,
  filters: JobFilters = {},
  page = 1
): Promise<PaginatedResult<Job>> {
  // Firestore doesn't support full-text search natively.
  // This uses a simple keyword match on title/companyName.
  // For production scale, integrate Algolia or Meilisearch.
  const constraints: QueryConstraint[] = [where("active", "==", true)];

  if (filters.category) {
    constraints.push(where("category", "==", filters.category));
  }
  if (filters.state) {
    constraints.push(where("state", "==", filters.state));
  }
  if (filters.city) {
    constraints.push(where("city", "==", filters.city));
  }
  if (filters.remote !== undefined) {
    constraints.push(where("remote", "==", filters.remote));
  }
  if (filters.visaSponsorship !== undefined) {
    constraints.push(where("visaSponsorship", "==", filters.visaSponsorship));
  }
  if (filters.employmentType) {
    constraints.push(where("employmentType", "==", filters.employmentType));
  }

  constraints.push(orderBy("postedAt", "desc"));
  constraints.push(limit(PAGE_SIZE));

  const q = query(collection(db, JOBS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  const term = searchTerm.toLowerCase();
  const filtered = snapshot.docs
    .map(mapJob)
    .filter(
      (job) =>
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.skills?.some((skill: string) => skill.toLowerCase().includes(term))
    );

  return {
    items: filtered,
    lastVisible: undefined,
    hasMore: false,
    page,
    pageSize: PAGE_SIZE,
  };
}