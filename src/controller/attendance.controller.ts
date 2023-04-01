import { Request, Response } from "express";
import { IAttendance } from "../models/attendance.model";
import { CourseModel, ICourse } from "../models/course.model";
import {
  pushingDaysDate,
  singleDayAttendance,
  updateAttendance,
  allDaysAttendance
} from "../services/attendance.service";
const cron = require("node-cron");
const moment = require('moment-timezone');


export const insertCourseDays = async (code: string, start: any, end: any) => {
  try {
    const dateStringStart = start;
    const dateParts = dateStringStart.split("-");
    const dateObjectStart = new Date(
      parseInt(dateParts[2]),
      parseInt(dateParts[0]) - 1,
      parseInt(dateParts[1])
    );

    const dateStringEnd = end;
    const datePartsEnd = dateStringEnd.split("-");
    const dateObjectEnd = new Date(
      parseInt(datePartsEnd[2]),
      parseInt(datePartsEnd[0]) - 1,
      parseInt(datePartsEnd[1])
    );

    const getDaysArray = (start: any, end: any) => {
      for (
        var arr = [], dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + 1)
      ) {
        arr.push(new Date(dt));
      }
      return arr;
    };

    const dayList = getDaysArray(dateObjectStart, dateObjectEnd);
    const daysArray = dayList.map((v) => {
      const month =
        v.getMonth() + 1 < 10 ? "0" + (v.getMonth() + 1) : v.getMonth() + 1;
      const date = v.getDate() < 10 ? "0" + v.getDate() : v.getDate();
      const year = v.getFullYear();
      return `${month}-${date}-${year}`;
    });

    let daysObjectArray: IAttendance[] = [];
    for (let i = 0; i < daysArray.length; i++) {
      const dayDocument: IAttendance = {
        courseCode: code,
        date: daysArray[i],
        attendance: [{}],
      };
      daysObjectArray.push(dayDocument);
    }
    console.log(dayList, daysArray);

    pushingDaysDate(daysObjectArray);
  } catch (error) {
    console.log(error);
  }
};

export const attendanceUpdate = async (req: Request, res: Response) => {
  let token = req.headers.authorization?.split(" ")[1];
  const userEmail =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).email;
  const userPhone =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).phone;
  const courseCode =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      .courseCode;
  const { date, status } = req.body;
  try {
    const attendance = updateAttendance(courseCode, date, userEmail, status, userPhone);
    return res.status(200).json({
      status: 200,
      data: attendance,
      message: "Successfully Update attendance",
    });
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};

export const getAttendanceSingleDay = async (req: Request, res: Response) => {
  let token = req.headers.authorization?.split(" ")[1];
  const courseCode =token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).courseCode;
  const role =token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).role;
  const email =token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).email;
  const dayDate = req.body.date;
  try {
    const dayAttendance = await singleDayAttendance(courseCode, dayDate, role, email)
    return dayAttendance
  } catch (error) {
    console.log(error);
  }
};

export const getAllDaysAttendance = async (req: Request, res: Response) => {
  let token = req.headers.authorization?.split(" ")[1];
  const courseCode =token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).courseCode;
  const role =token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).role;
  const email =token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).email;
  try {
    const courseAttendance = await allDaysAttendance(courseCode, role, email);
    return res
    .status(200)
    .json(courseAttendance);
  } catch (error) {
    console.log(error);
  }
};




cron.schedule('0 0 * * *', function() {
  
}, {
  timezone: 'Israel'
});