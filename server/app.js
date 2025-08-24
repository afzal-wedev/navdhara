import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconnect.js";
import { authRouter } from "./router/authRoutes.js";
import { setupGoogleStrategy } from "./config/passport.js";
import passport from "passport";
import cookieParser from "cookie-parser";


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
