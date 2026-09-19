import { Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../firebase.ts";

const router = Router();
const collections = db.collection("collections");

// Each collection document looks like:
// { name: string, members: string[] (emails), images: { id, url, tags }[], isPublic: boolean, createdAt: number }

// Fetches one collection and makes sure the current user is a member of it.
async function getCollection(id: string, email: string) {
  const ref = collections.doc(id);
  const data = (await ref.get()).data();
  if (!data || !data.members.includes(email)) throw new Error("Collection not found");
  return { ref, data };
}

// GET /api/collections → every collection the user is a member of, newest first
router.get("/", async (req, res) => {
  const snapshot = await collections.where("members", "array-contains", res.locals.email).get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  list.sort((a, b) => b.createdAt - a.createdAt);
  res.json(list);
});

// POST /api/collections { name } → create a collection owned by the user
router.post("/", async (req, res) => {
  const collection = { name: req.body.name, members: [res.locals.email], images: [], isPublic: false, createdAt: Date.now() };
  const doc = await collections.add(collection);
  res.json({ id: doc.id, ...collection });
});

// GET /api/collections/:id → one collection with its images
router.get("/:id", async (req, res) => {
  const { data } = await getCollection(req.params.id, res.locals.email);
  res.json({ id: req.params.id, ...data });
});

// PATCH /api/collections/:id { name?, isPublic? } → edit a collection's settings
router.patch("/:id", async (req, res) => {
  const { ref } = await getCollection(req.params.id, res.locals.email);
  await ref.update(req.body);
  res.json({ ok: true });
});

// DELETE /api/collections/:id → delete a collection
router.delete("/:id", async (req, res) => {
  const { ref } = await getCollection(req.params.id, res.locals.email);
  await ref.delete();
  res.json({ ok: true });
});

// POST /api/collections/:id/images { id, url, tags } → save an image
router.post("/:id/images", async (req, res) => {
  const { ref } = await getCollection(req.params.id, res.locals.email);
  await ref.update({ images: FieldValue.arrayUnion(req.body) });
  res.json({ ok: true });
});

// DELETE /api/collections/:id/images/:imageId → remove an image
router.delete("/:id/images/:imageId", async (req, res) => {
  const { ref, data } = await getCollection(req.params.id, res.locals.email);
  const images = data.images.filter((img) => img.id !== Number(req.params.imageId));
  await ref.update({ images });
  res.json({ ok: true });
});

// POST /api/collections/:id/share { email } → let another user view and edit
router.post("/:id/share", async (req, res) => {
  const { ref } = await getCollection(req.params.id, res.locals.email);
  await ref.update({ members: FieldValue.arrayUnion(req.body.email.toLowerCase()) });
  res.json({ ok: true });
});

export default router;
