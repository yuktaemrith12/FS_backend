//  -------------------------- server.js ------------------------
// Main entry point for the Express.js backend server.
// Handles middleware setup, routing, static file serving, and MongoDB API endpoints.
// This server interacts with MongoDB Atlas via native driver (no Mongoose).
// --------------------------------------------------------------

// --- Import Core Dependencies ---
import express from "express";         // Express framework for REST API
import dotenv from "dotenv";           // Loads environment variables from .env
import cors from "cors";               // Enables CORS for frontend-backend communication
import morgan from "morgan";           // HTTP request logger middleware
import path from "path";               // Provides file path utilities
import { fileURLToPath } from "url";   // Converts module URL to local file path (for ESM)

// --- Import Route Modules ---
import lessonsRouter from "./routes/lessons.js"; 
import ordersRouter from "./routes/orders.js";    
import searchRouter from "./routes/search.js";    

// --- Environment Setup ---
dotenv.config();                       // Initialize environment variables
const app = express();                 // Create Express application instance
const PORT = process.env.PORT || 10000; // Use environment port or default to 10000

// -----------------------------
// Global Middleware Setup
// -----------------------------

// Logger: prints all incoming HTTP requests (method, URL, response time, etc.)
app.use(morgan("dev"));

// Body Parser: parses incoming JSON request bodies (required for POST/PUT)
app.use(express.json());

// CORS: allows the frontend (e.g., Vue.js app on GitHub Pages) to access the API
app.use(cors());

// -----------------------------
// Static File Serving
// -----------------------------
// Used to serve lesson images (or other public assets) from /public folder.
// Files are accessed via /static/... route.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/static", express.static(path.join(__dirname, "public")));

// Optional: custom handler for missing images in /lessons directory
app.get("/static/lessons/:file", (req, res, next) => {
  const abs = path.join(__dirname, "public", "lessons", req.params.file);
  res.sendFile(abs, (err) => {
    if (err) res.status(404).json({ error: "Image not found" });
  });
});

// -----------------------------
// API Routes
// -----------------------------
// Each router module defines its own endpoints and logic.
// These follow REST API conventions and connect to MongoDB collections.
app.use("/lessons", lessonsRouter);   
app.use("/orders", ordersRouter);      
app.use("/search", searchRouter);      

// -----------------------------
// Health Check Endpoint
// -----------------------------
// Used to verify server status (useful for Render deployment monitoring)
app.get("/", (_req, res) => res.json({ ok: true }));

// -----------------------------
// Server Startup
// -----------------------------
// Starts the Express server and listens on the specified port.
// Confirms successful startup in the console.
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
