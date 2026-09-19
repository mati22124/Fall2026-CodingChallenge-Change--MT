import express from "express";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "./middleware/auth.ts";
import searchRoutes from "./routes/search.ts";
import collectionsRoutes from "./routes/collections.ts";
import publicRoutes from "./routes/public.ts";

const app = express();
app.use(express.json()); // parse JSON request bodies into req.body

app.use("/api/public", publicRoutes); // registered before requireAuth, so no sign-in needed
app.use("/api", requireAuth); // everything below needs a signed-in user

app.use("/api/search", searchRoutes);
app.use("/api/collections", collectionsRoutes);

// Any error thrown inside a route lands here instead of crashing the server.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
