import express, { Request, Response } from "express";
import { getAllData } from "../controller/monday.controller";
import { authCheck } from "../middleware/authCheck";


const mondayRouter = express.Router();

mondayRouter.get("/getData",authCheck('admin') ,getAllData);


export default mondayRouter;