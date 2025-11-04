// routes/search.js
import express from "express";
import { lessonsCol } from "../db.js";

const router = express.Router();

// GET /search?q=term  (matches topic/location/price/space)
router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(safe, "i");

  const pipeline = [
    { $addFields: { priceStr: { $toString: "$price" }, spaceStr: { $toString: "$space" } } },
    { $match: { $or: [{ topic: regex }, { location: regex }, { priceStr: regex }, { spaceStr: regex }] } }
  ];

  try {
    const items = await (await lessonsCol()).aggregate(pipeline).toArray();
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
