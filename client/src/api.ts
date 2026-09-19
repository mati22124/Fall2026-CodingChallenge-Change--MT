import { auth } from "./firebase";

// Calls our Express backend. Attaches the signed-in user's Firebase token so the
// server knows who is asking, and sends/receives JSON.
export async function api(path: string, method = "GET", body?: object) {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch("/api" + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  return response.json();
}
