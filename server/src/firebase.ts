import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// serviceAccount.json is a private key that lets this server act as a Firebase admin.
initializeApp({ credential: cert("serviceAccount.json") });

export const auth = getAuth();
export const db = getFirestore();
