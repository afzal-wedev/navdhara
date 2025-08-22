import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconnect.js";
import { userRouter } from "./router/userRouter.js";
import openAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.use("/users", userRouter);

// MongoDB connection
connectDB();
app.listen(PORT, () => {
  console.log("you server is running");
});
//open ai demo


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/gemi", async (req, res) => {
  try {
    const { text } = req.body; // get user input from request body

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `:\n\n${text}`
    );

    const summary = result.response.text();
    res.json({ summary }); // send response back to client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});







// Example route
app.get("/", (req, res) => {
  res.send("API is running...");
});
