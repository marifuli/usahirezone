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
import type { City } from "@/types";

const CITIES_COLLECTION = "cities";

function mapCity(doc: QueryDocumentSnapshot<DocumentData>): City {
  return { id: doc.id, ...doc.data() } as City;
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const docRef = doc(db, CITIES_COLLECTION, slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as City;
}

export async function getCities(count = 200): Promise<City[]> {
  const q = query(
    collection(db, CITIES_COLLECTION),
    where("active", "==", true),
    orderBy("name", "asc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCity);
}

export async function getCitiesByState(
  stateAbbreviation: string,
  count = 50
): Promise<City[]> {
  const q = query(
    collection(db, CITIES_COLLECTION),
    where("active", "==", true),
    where("stateAbbreviation", "==", stateAbbreviation),
    orderBy("name", "asc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCity);
}