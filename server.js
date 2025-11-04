// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import lessonsRouter from "./routes/lessons.js";
import ordersRouter from "./routes/orders.js";
import searchRouter from "./routes/search.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// --- required middleware ---
app.use(morgan("dev"));          // logger
app.use(express.json());         // JSON body parser
app.use(cors());                 // allow frontend origin

// --- static files (serve lesson images) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/static", express.static(path.join(__dirname, "public")));

// explicit “missing image” handler example (optional)
app.get("/static/lessons/:file", (req, res, next) => {
  const abs = path.join(__dirname, "public", "lessons", req.params.file);
  res.sendFile(abs, (err) => {
    if (err) res.status(404).json({ error: "Image not found" });
  });
});

// --- api routes ---
app.use("/lessons", lessonsRouter);
app.use("/orders", ordersRouter);
app.use("/search", searchRouter);

// health
app.get("/", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
