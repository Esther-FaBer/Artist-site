import "dotenv/config";
import express from "express";
import cors from "cors";

import worksRouter from "./routes/works";
import exhibitionsRouter from "./routes/exhibitions";
import postsRouter from "./routes/posts";
import contactRouter from "./routes/contact";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT ?? 4000;

// Middleware

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes

app.use("/api/works", worksRouter);
app.use("/api/exhibitions", exhibitionsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/contact", contactRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Error handler

app.use(errorHandler);

// Start server

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

export default app;
