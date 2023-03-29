import { Request, Response } from "express";
import { addingMondayData, getTokenFromDB } from "../services/course.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const addMondayData = async (req: Request, res: Response) => {
  const { client_id, client_secret, signing_secret, app_id, mondayToken, boardId } =
    req.body;
  const courseName = req.body.courseName;

  try {
    // hashing all the monday data:
    const mondayDataToken = jwt.sign(
      {
        client_id: client_id,
        client_secret: client_secret,
        signing_secret: signing_secret,
        app_id: app_id,
        mondayToken: mondayToken,
        boardId: boardId
      },
      config.secretKey,
      {
        expiresIn: "2h",
      }
    );

    const mondayData = mondayDataToken;
     
    addingMondayData(courseName, mondayData);
    return res.status(200).json({
      status: 201,
      message: "Successfully Add Data",
    });
  } catch (error) {
    console.log(error);
  }
};


export const getMondayToken = async (res: Response) => {
  try {
    const token = await getTokenFromDB();
     res.status(200).json(token);
     return token
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};
