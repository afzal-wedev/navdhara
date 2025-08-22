import express from 'express'
import { registerUser } from '../controller/userControllers.js';

 export const userRouter = express.Router();

 userRouter.post("/register",registerUser);