import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import espRoutes from "./routes/espRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/esp", espRoutes);

app.get("/", (req, res) => res.json({ ok: true }));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Backend running on port ${PORT}`)
);
