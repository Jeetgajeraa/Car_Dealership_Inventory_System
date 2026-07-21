import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const app = express();

app.use(express.json());

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const PORT = process.env.PORT || 3000;

app.get("/", async (_req, res) => {
  try {
    await prisma.$connect();

    res.json({
      message: "Server running",
      database: "Connected",
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
});