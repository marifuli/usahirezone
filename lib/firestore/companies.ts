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
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Company } from "@/types";

const COMPANIES_COLLECTION = "companies";

function mapCompany(doc: QueryDocumentSnapshot<DocumentData>): Company {
  return { id: doc.id, ...doc.data() } as Company;
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const docRef = doc(db, COMPANIES_COLLECTION, slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Company;
}

export async function getCompanies(count = 50): Promise<Company[]> {
  const q = query(
    collection(db, COMPANIES_COLLECTION),
    where("active", "==", true),
    orderBy("name", "asc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCompany);
}

export async function getFeaturedCompanies(count = 12): Promise<Company[]> {
  const q = query(
    collection(db, COMPANIES_COLLECTION),
    where("active", "==", true),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCompany);
}