//  -------------------------- server.js ------------------------
// Main entry point for the Express.js backend server.
// Handles middleware setup, routing, static file serving, and MongoDB API endpoints.
// --------------------------------------------------------------

// --- Import Core Dependencies ---
import express from "express";         // Express framework for REST API
import dotenv from "dotenv";           // reads variables from .env
import cors from "cors";               // middleware so that GitHub Pages can call the API
import morgan from "morgan";           // HTTP request logger middleware
import path from "path";                
import { fileURLToPath } from "url";    

// --- Import Route Modules ---
import lessonsRouter from "./routes/lessons.js"; 
import ordersRouter from "./routes/orders.js";    
import searchRouter from "./routes/search.js";    

// --- Environment Setup ---
dotenv.config();                         
const app = express();                  
const PORT = process.env.PORT || 10000; 


// -----------------------------
// Global Middleware Setup
// -----------------------------

// Logger: prints all incoming HTTP requests  
app.use(morgan("dev"));

// Body Parser: parses incoming JSON request bodies (required for POST/PUT)
app.use(express.json());

// CORS: allows the frontend ( GitHub Pages) to access the API
app.use(cors());

// --------------------------------
// Static File Serving From Backend
// --------------------------------


// Determine __dirname in ES modules  
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory at the /static URL path
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
app.use("/lessons", lessonsRouter);   
app.use("/orders", ordersRouter);      
app.use("/search", searchRouter);      

// -----------------------------
// Health Check Endpoint
// -----------------------------
// To verify server status ( Render deployment monitoring)
app.get("/", (_req, res) => res.json({ ok: true }));


// -----------------------------
// Server Startup
// -----------------------------
// Starts the Express server and listens on the port.
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
