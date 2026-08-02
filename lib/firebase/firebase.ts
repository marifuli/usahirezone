import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getStorage, connectStorageEmulator, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuildProcess12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "usahirezone.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "usahirezone",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "usahirezone.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:1234567890",
};

// Singleton pattern to avoid re-initializing Firebase on hot reloads
function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

export const app = getFirebaseApp();
export const db: Firestore = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  if (typeof window !== "undefined") {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  }
}
