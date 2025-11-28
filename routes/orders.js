//  -------------------- routes/orders.js ------------------------
// This file handles all "orders" related API routes.
// It lets the frontend send a new order to be saved in the MongoDB "order" collection.

import express from "express";
import { ordersCol } from "../db.js";  

const router = express.Router();  

// --------------------
// POST /orders
// --------------------
// This route is called when the user completes checkout.

router.post("/", async (req, res) => {

  // Extract data from the request body
  const { name, phone, lessonIDs, space } = req.body || {};

  // Validation – check if required fields are provided
  if (
    !name || !phone ||
    !Array.isArray(lessonIDs) ||
    typeof space !== "number"
  ) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  // Create a new order document
  try {
    const doc = {
      name: String(name).trim(),         // name
      phone: String(phone).trim(),       //  phone number
      lessonIDs: lessonIDs.map(String),  // list of lesson IDs being booked
      space,                             // number of spaces booked
      createdAt: new Date()              // timestamp of order creation
    };

    // Insert the new order into the MongoDB "order" collection
    const result = await (await ordersCol()).insertOne(doc);

    // Return a success response (201 = Created)
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save order" }); 
  }
});

export default router; // export router for server.js
