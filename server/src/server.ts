import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "node:path";
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

// In production the built React app lives in client/dist and Express serves it.
// Any URL that is not an API route gets index.html so React Router can handle it.
const clientDir = path.resolve("../client/dist");
app.use(express.static(clientDir));
app.get("/{*splat}", (req, res) => res.sendFile(path.join(clientDir, "index.html")));

// Any error thrown inside a route lands here instead of crashing the server.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const port = Number(process.env.PORT) || 3000; // Render sets PORT; locally we use 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
