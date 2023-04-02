import { Request, Response } from "express";
import { courseCreation, getTokenFromDB } from "../services/course.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { ICourse } from "../models/course.model";
import { insertCourseDays } from "./attendance.controller";

export const addCourseData = async (req: Request, res: Response) => {
  const {
    mondayToken,
    boardId,
    startDate,
    endDate,
    classRoomLink,
    courseCode
  } = req.body;

  // check how much time the course will run to give exp for the monday token

  // admin token decoded
  let token = req.headers.authorization?.split(" ")[1];

  const adminEmail = token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).email;

  try {
    // hashing all the monday data:
    const mondayDataToken: string = jwt.sign(
      {
        mondayToken: mondayToken,
        boardId: boardId,
      },
      config.secretKey,
      {
        expiresIn: "2h",
      }
    );


    // course data in one object:
    const courseData:ICourse = {
      startingDate: startDate,
      endingDate: endDate,
      admin: adminEmail,
      classRoomLink: classRoomLink,
      mondayData: mondayDataToken,
      courseCode: courseCode,
    };
   
    courseCreation(courseCode, courseData);
    // pushing days to attendance according to course dates:
    insertCourseDays(courseCode,startDate, endDate )
    return res.status(200).json({
      status: 201,
      message: "Successfully Add Data",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMondayToken = async (courseCode: string,res: Response) => {
  const code = courseCode;
  
  try {
    const token = await getTokenFromDB(code);
    res.status(200).json(token);
    return token;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};
