import express, { Request, Response } from "express";
import { getAllDays } from "../controller/days.controller";


const daysRouter = express.Router();

daysRouter.get("/", getAllDays);


export default daysRouter; 