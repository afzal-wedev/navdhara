import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconnect.js";
import { authRouter } from "./router/authRoutes.js";
import { setupGoogleStrategy } from "./config/passport.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { ressumeRouter } from "./router/resumeValidate.js";
import { genAI } from "./services/gemiservices.js";


dotenv.config();
const app = express();

app.use(cors({
  origin :"http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

setupGoogleStrategy();


const PORT = process.env.PORT || 5000;
app.use("/auth", authRouter);
app.use("/resume",ressumeRouter)
let chatSessions = {};
//chat interview 

app.post("/api/start-interview", async (req, res) => {
  try {
    const { resumeText, userId } = req.body;

    // Start Gemini Chat
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: `This is my resume: ${resumeText}. Act as an HR and start interviewing me based on it.` }
          ]
        }
      ],
    });

    // Save session
    chatSessions[userId] = chat;

    // First HR Question
    const result = await chat.sendMessage("Start the interview with me.");
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Start interview error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Continue Interview
app.post("/api/interview", async (req, res) => {
  try {
    const { userId, message } = req.body;

    const chat = chatSessions[userId];
    if (!chat) {
      return res.status(400).json({ error: "Interview not started." });
    }

    const result = await chat.sendMessage(message);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Interview error:", err);
    res.status(500).json({ error: err.message });
  }
});

// MongoDB connection
connectDB();
app.get("/", (req, res) => {
  res.send("API is running...");
})
app.listen(PORT, () => {
  console.log("you server is running");
});
//open ai demo


;
