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
import type { State } from "@/types";

const STATES_COLLECTION = "states";

function mapState(doc: QueryDocumentSnapshot<DocumentData>): State {
  return { id: doc.id, ...doc.data() } as State;
}

export async function getStateBySlug(slug: string): Promise<State | null> {
  const docRef = doc(db, STATES_COLLECTION, slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as State;
}

export async function getStates(count = 60): Promise<State[]> {
  const q = query(
    collection(db, STATES_COLLECTION),
    where("active", "==", true),
    orderBy("name", "asc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapState);
}