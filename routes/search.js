// ---------------- routes/search.js ---------------------------
// This file handles the search functionality for lessons.

import express from "express";
import { lessonsCol } from "../db.js"; // function to access the "lesson" collection

const router = express.Router(); // create a router


// --------------------
// GET /search?q=term
// --------------------

// The frontend sends a query string (e.g., /search?q=math) 
// Backend returns all lessons matching that term.
router.get("/", async (req, res) => {

  // Read and clean the search query (q)
  const q = (req.query.q || "").trim();

  // If no search term => return an empty array
  if (!q) return res.json([]);

  // Escape special regex characters with special meaning to make it a safer query
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create a case-insensitive regular expression for matching text
  const regex = new RegExp(safe, "i");


  // MongoDB aggregation pipeline

  const pipeline = [
      // Step 1: Convert price and space to strings (so they can be searched like text)
    { 
      $addFields: { 
        priceStr: { $toString: "$price" }, 
        spaceStr: { $toString: "$space" } 
      } 
    },

      // Step 2: Match documents where fields matches the regex
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
