import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// serviceAccount.json is a private key that lets this server act as a Firebase admin.
// Locally it sits next to package.json; on Render it lives at /etc/secrets/, set via env var.
initializeApp({ credential: cert(process.env.SERVICE_ACCOUNT_PATH ?? "serviceAccount.json") });

export const auth = getAuth();
export const db = getFirestore();
