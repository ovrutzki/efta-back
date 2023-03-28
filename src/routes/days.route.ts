import express, { Request, Response } from "express";
import { getAllDays , attendanceUpdate} from "../controller/days.controller";


const daysRouter = express.Router();

daysRouter.get("/", getAllDays);

daysRouter.put('/attendanceUpdate',attendanceUpdate );


export default daysRouter; 