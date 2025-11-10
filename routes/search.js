// ---------------- routes/search.js ---------------------------
// This file handles the search functionality for lessons.
// It allows users to search lessons by topic, location, price, or available spaces.

import express from "express";
import { lessonsCol } from "../db.js"; // function to access the "lesson" collection

const router = express.Router(); // create a router object for search routes

// --------------------
// GET /search?q=term
// --------------------
// This route performs a full-text style search across multiple fields.
// The frontend sends a query string (e.g., /search?q=math)
// and the backend returns all lessons matching that term.
router.get("/", async (req, res) => {
  // Get the search term from the query string and remove extra spaces
  const q = (req.query.q || "").trim();

  // If no search term is provided, return an empty array
  if (!q) return res.json([]);

  // Escape special regex characters to prevent regex injection
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create a case-insensitive regular expression for matching text
  const regex = new RegExp(safe, "i");

  // MongoDB aggregation pipeline:
  // Step 1: Convert price and space to strings (so they can be searched like text)
  // Step 2: Match documents where topic, location, price, or space matches the regex
  const pipeline = [
    { 
      $addFields: { 
        priceStr: { $toString: "$price" }, 
        spaceStr: { $toString: "$space" } 
      } 
    },
    { 
      $match: { 
        $or: [
          { topic: regex },
          { location: regex },
          { priceStr: regex },
          { spaceStr: regex }
        ] 
      } 
    }
  ];

  try {
    // Run the pipeline and return all matched lessons
    const items = await (await lessonsCol()).aggregate(pipeline).toArray();
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Search failed" }); // error if query execution fails
  }
});

export default router; // export router so it can be used in server.js
