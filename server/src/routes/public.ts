import { Router } from "express";
import { db } from "../firebase.ts";

const router = Router();

// GET /api/public/:id → a public collection. No sign-in needed (mounted before requireAuth).
router.get("/:id", async (req, res) => {
  const data = (await db.collection("collections").doc(req.params.id).get()).data();
  if (!data?.isPublic) throw new Error("Collection not found");
  res.json({ id: req.params.id, ...data });
});

export default router;
