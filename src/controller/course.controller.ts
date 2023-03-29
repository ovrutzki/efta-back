import { Request, Response } from "express";
import { courseCreation, getTokenFromDB } from "../services/course.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { ICourse } from "../models/course.model";

export const addMondayData = async (req: Request, res: Response) => {
  const {
    client_id,
    client_secret,
    signing_secret,
    app_id,
    mondayToken,
    boardId,
    startDate,
    EndDate,
    classRoomLink,
    courseCode
  } = req.body;
  // const courseCode = req.body.courseCode;

  // admin token decoded
  let token = req.headers.authorization?.split(" ")[1];

  const adminEmail =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).email;

  try {
    // hashing all the monday data:
    const mondayDataToken: string = jwt.sign(
      {
        client_id: client_id,
        client_secret: client_secret,
        signing_secret: signing_secret,
        app_id: app_id,
        mondayToken: mondayToken,
        boardId: boardId,
      },
      config.secretKey,
      {
        expiresIn: "2h",
      }
    );

    // const mondayData = mondayDataToken;

    // course data in one object:
    const courseData:ICourse = {
      startingDate: startDate,
      endingDate: EndDate,
      admin: adminEmail,
      classRoomLink: classRoomLink,
      mondayData: mondayDataToken,
      courseCode: courseCode,
    };
   
    console.log(typeof courseData);
    
    courseCreation(courseCode, courseData);
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
  console.log("code", code);
  
  try {
    const token = await getTokenFromDB(code);
    res.status(200).json(token);
    return token;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};
