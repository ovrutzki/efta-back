import { Request, Response } from "express";
import { IAttendance } from "../models/attendance.model";
import { CourseModel, ICourse } from "../models/course.model";
import {
  pushingDaysDate,
  updateAttendance,
} from "../services/attendance.service";
const cron = require("node-cron");

export const insertCourseDays = async (code: string, start: any, end: any) => {
  try {
      const dateStringStart = start;
      const dateParts = dateStringStart.split("-");
      const dateObjectStart = new Date( parseInt(dateParts[2]), parseInt(dateParts[0]) - 1,parseInt(dateParts[1]));

      const dateStringEnd = end;
      const datePartsEnd = dateStringEnd.split("-");
      const dateObjectEnd = new Date( parseInt(datePartsEnd[2]), parseInt(datePartsEnd[0]) - 1,parseInt(datePartsEnd[1]));

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

    const dayList = getDaysArray(new Date(dateObjectStart), new Date(dateObjectEnd));
    const daysArray = dayList.map((v) => v.toISOString().slice(0, 10));
    console.log(daysArray);

    let daysObjectArray: IAttendance[] = [];
    for (let i = 0; i < daysArray.length; i++) {
      const dayDocument: IAttendance = {
        courseCode: code,
        date: daysArray[i],
        attendance: [{}],
      };
      daysObjectArray.push(dayDocument);
    }
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
  const courseCode =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      .courseCode;
  const { date, status } = req.body;
  try {
    const attendance = updateAttendance(courseCode, date, userEmail, status);
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
