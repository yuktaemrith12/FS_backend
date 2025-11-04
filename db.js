import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

export async function getDb() {
  if (!client.topology || client.topology.isDestroyed()) {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  }
  return client.db(process.env.DB_NAME || "fs_coursework");
}

export async function lessonsCol() {
  const db = await getDb();
  return db.collection("lesson");
}

export async function ordersCol() {
  const db = await getDb();
  return db.collection("order");
}
