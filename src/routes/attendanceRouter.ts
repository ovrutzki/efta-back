import express, { Request, Response } from "express";
import { attendanceUpdate, getAttendanceSingleDay, getAllDaysAttendance } from "../controller/attendance.controller";


const attendanceRouter = express.Router();

attendanceRouter.post('/attendanceUpdate',attendanceUpdate );

attendanceRouter.get('/singleDayAttendance',getAttendanceSingleDay );

attendanceRouter.get('/allDaysAttendance',getAllDaysAttendance);




 


export default attendanceRouter;