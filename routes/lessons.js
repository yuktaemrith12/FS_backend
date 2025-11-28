// ----------------- routes/lessons.js -------------------
// This file defines all API routes related to "lessons".
// It connects to the MongoDB "lesson" collection and allows


import express from "express";
import { lessonsCol } from "../db.js";  // function to get "lesson" collection
import { ObjectId } from "mongodb";     // used for handling MongoDB's unique object IDs

 // Create a router object to define routes
const router = express.Router();       


// --------------------
// GET /lessons
// --------------------
// This route is called when the frontend wants to get all lessons.
router.get("/", async (_req, res) => {
  try {
    const items = await (await lessonsCol()).find({}).toArray();    // get all lessons
    res.json(items);                                                // send lessons to frontend as JSON
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch lessons" });    
  }
});



// --------------------
// PUT /lessons/:id
// --------------------
// This route updates a specific lesson using its ID.
router.put("/:id", async (req, res) => { 
  try {
    const id = req.params.id;                // get lesson ID from the URL



    //ID handling
    const filter = /^[a-f0-9]{24}$/.test(id) // 24-character (a-f) and (0-9) MongoDB ObjectId.
      ? { _id: new ObjectId(id) }            // valid ObjectId for Mongo
      : { _id: id };                         // treat as string ID                    

    const update = req.body && typeof req.body === "object" ? req.body : {}; // get update data
 

    // Update the lesson and return the updated version
    const result = await (await lessonsCol()).findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" } 
    );


    // If no lesson is found with that ID
    if (!result) return res.status(404).json({ error: "Lesson not found" });

    res.json(result); // send updated lesson back to frontend
  } catch (e) {
    res.status(400).json({ error: "Invalid ID or request data" });
  }
});

export default router; // export router for server.js
