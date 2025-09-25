import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { prisma } from "@/db";

dotenv.config();

import { authenticateUser } from "./middleware/auth";
import v1Router from "./v1Router";

const app = express();
const PORT = process.env.PORT || 2550;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(authenticateUser);
app.use("/api/v1", v1Router);
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});
