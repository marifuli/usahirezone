import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Questionnaire } from "@/types";

const QUESTIONNAIRES_COLLECTION = "questionnaires";

function mapQuestionnaire(doc: QueryDocumentSnapshot<DocumentData>): Questionnaire {
  return { id: doc.id, ...doc.data() } as Questionnaire;
}

export async function getQuestionnaireById(
  id: string
): Promise<Questionnaire | null> {
  const docRef = doc(db, QUESTIONNAIRES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Questionnaire;
}

export async function getActiveQuestionnaires(
  count = 50
): Promise<Questionnaire[]> {
  const q = query(
    collection(db, QUESTIONNAIRES_COLLECTION),
    where("active", "==", true),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapQuestionnaire);
}