import { Router } from "express";

const router = Router();

// GET /api/search?q=cats
// Asks Pixabay for images and returns only the fields the frontend needs.
router.get("/", async (req, res) => {
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${req.query.q}&per_page=30`;
  const data = await fetch(url).then((r) => r.json());

  const images = data.hits.map((hit) => ({
    id: hit.id,
    url: hit.webformatURL,
    tags: hit.tags,
  }));

  res.json(images);
});

export default router;
