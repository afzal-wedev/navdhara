import express from 'express';
import { getFeedback } from '../controller/ResumeValidatcontroller.js';
export const ressumeRouter = express.Router();

ressumeRouter.post("/feedback",getFeedback);