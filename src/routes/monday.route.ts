import express, { Request, Response } from "express";
import { getAllData } from "../controller/monday.controller";


const mondayRouter = express.Router();

mondayRouter.get("/getData", getAllData);


export default mondayRouter;