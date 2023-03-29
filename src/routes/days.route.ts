import express, { Request, Response } from "express";
import { getAllDays , attendanceUpdate, getOneDay} from "../controller/days.controller";
import { authCheck } from "../middleware/authCheck";


const daysRouter = express.Router();

daysRouter.get("/", getAllDays);

daysRouter.get("/getOneDay", getOneDay);

daysRouter.put('/attendanceUpdate',attendanceUpdate );


export default daysRouter; 