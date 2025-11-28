// ------------------- db.js ----------------------------
// MongoDB Connection and Collection Accessor Functions
// ------------------------------------------------------


// Import the MongoDB client 
import { MongoClient } from "mongodb";

// Import to load environment variables from the .env file
import dotenv from "dotenv";
dotenv.config();

// Create a new MongoDB client instance  
const client = new MongoClient(process.env.MONGODB_URI);


// --------------------- getDb() -------------------------
//  Connects to MongoDB Atlas and returns the database instance.
//
//  * - Checks if a client connection already exists or has been destroyed.
//  * - If not connected, it initiates a new connection to MongoDB Atlas.
//  * - Uses the DB_NAME from the environment variables or defaults to 'fs_coursework'.

export async function getDb() {
  if (!client.topology || client.topology.isDestroyed()) {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  }
  return client.db(process.env.DB_NAME || "fs_coursework");
}


// --------------- lessonsCol() -----------------
//  Provides access to the 'lesson' collection in MongoDB.
//  Used by routes such as GET /lessons or PUT /lessons/:id.
 
export async function lessonsCol() {
  const db = await getDb();
  return db.collection("lesson");
}


// ------------ ordersCol() ---------------------
//  Provides access to the 'order' collection in MongoDB.
//  Used by routes such as POST /orders.
 
export async function ordersCol() {
  const db = await getDb();
  return db.collection("order");
}
