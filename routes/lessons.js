// routes/lessons.js
import express from "express";
import { lessonsCol } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /lessons → list all lessons
router.get("/", async (_req, res) => {
  try {
    const items = await (await lessonsCol()).find({}).toArray();
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// PUT /lessons/:id → update any fields (e.g., { "space": 3 })
router.put("/:id", async (req, res) => {
  try {
    // support either ObjectId or string ids from your seed
    const id = req.params.id;
    const filter = /^[a-f0-9]{24}$/.test(id) ? { _id: new ObjectId(id) } : { _id: id };
    const update = req.body && typeof req.body === "object" ? req.body : {};

    const result = await (await lessonsCol()).findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "Invalid id or payload" });
  }
});

export default router;
