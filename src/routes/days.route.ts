import express, { Request, Response } from "express";
import { getAllDays , getOneDay} from "../controller/days.controller";
import { authCheck } from "../middleware/authCheck";


const daysRouter = express.Router();

daysRouter.get("/", getAllDays);

daysRouter.get("/getOneDay", getOneDay);



export default daysRouter; 