// ----------------- routes/lessons.js -------------------
// This file defines all API routes related to "lessons".
// It connects to the MongoDB "lesson" collection and allows
// the frontend to get all lessons or update them when needed.

import express from "express";
import { lessonsCol } from "../db.js";  // function to access the "lesson" collection
import { ObjectId } from "mongodb";     // used for handling MongoDB's unique object IDs

const router = express.Router();        // create a router object to define routes

// --------------------
// GET /lessons
// --------------------
// This route is called when the frontend wants to get all lessons.
// It fetches all documents from the "lesson" collection in MongoDB
// and sends them as a JSON response to the frontend.
router.get("/", async (_req, res) => {
  try {
    const items = await (await lessonsCol()).find({}).toArray(); // get all lessons
    res.json(items); // send lessons to frontend
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch lessons" }); // send error if query fails
  }
});

// --------------------
// PUT /lessons/:id
// --------------------
// This route updates a specific lesson using its ID.
// It’s mainly used after a student checks out — to reduce "spaces".
// It can update any field (e.g., spaces, price, etc.)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id; // get lesson ID from the URL

    // Check if the ID is a valid MongoDB ObjectId
    // If not, treat it as a simple string (useful if data was seeded manually)
    const filter = /^[a-f0-9]{24}$/.test(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

    // The data to update comes from the frontend (e.g., { space: 3 })
    const update = req.body && typeof req.body === "object" ? req.body : {};

    // Update the lesson and return the updated version
    const result = await (await lessonsCol()).findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" } // return the updated document instead of the old one
    );

    // If no lesson is found with that ID
    if (!result) return res.status(404).json({ error: "Lesson not found" });

    res.json(result); // send updated lesson back to frontend
  } catch (e) {
    // Handles any invalid ID or JSON body errors
    res.status(400).json({ error: "Invalid ID or request data" });
  }
});

export default router; // export router to be used in server.js
