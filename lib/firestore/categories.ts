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
import type { Category } from "@/types";

const CATEGORIES_COLLECTION = "categories";

function mapCategory(doc: QueryDocumentSnapshot<DocumentData>): Category {
  return { id: doc.id, ...doc.data() } as Category;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const docRef = doc(db, CATEGORIES_COLLECTION, slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Category;
}

export async function getCategories(count = 100): Promise<Category[]> {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    where("active", "==", true),
    orderBy("name", "asc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCategory);
}