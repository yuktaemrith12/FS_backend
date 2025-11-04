// routes/orders.js
import express from "express";
import { ordersCol } from "../db.js";

const router = express.Router();

// POST /orders → { name, phone, lessonIDs:[], space:number }
router.post("/", async (req, res) => {
  const { name, phone, lessonIDs, space } = req.body || {};
  if (
    !name || !phone ||
    !Array.isArray(lessonIDs) ||
    typeof space !== "number"
  ) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  try {
    const doc = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      lessonIDs: lessonIDs.map(String),
      space,
      createdAt: new Date()
    };
    const result = await (await ordersCol()).insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save order" });
  }
});

export default router;
