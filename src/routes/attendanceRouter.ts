import express, { Request, Response } from "express";
import { attendanceUpdate } from "../controller/attendance.controller";


const attendanceRouter = express.Router();

attendanceRouter.post('/attendanceUpdate',attendanceUpdate );







export default attendanceRouter;