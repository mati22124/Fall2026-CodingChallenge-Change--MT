import type { Request, Response, NextFunction } from "express";
import { auth } from "../firebase.ts";

// Runs before every /api route. The frontend sends its Firebase token in the
// Authorization header; we verify it and remember the user's email for the route.
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
  try {
    const user = await auth.verifyIdToken(token);
    res.locals.email = user.email?.toLowerCase(); // lowercase so sharing is not case-sensitive
    next();
  } catch {
    res.status(401).json({ error: "Please sign in" });
  }
}
