import express, { Request, Response } from "express";
import {
  getDays,
  getSingleDay,
} from "../services/days.service";

export const getAllDays = async (req: Request, res: Response) => {
  let token = req.headers.authorization?.split(" ")[1];
  const courseCode =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      .courseCode;
  try {
    const days = await getDays(courseCode);
    return res.status(200).json(days);
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};

export const getOneDay = async (req: Request, res: Response) => {
  let token = req.headers.authorization?.split(" ")[1];
  const courseCode =
    token &&
    JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      .courseCode;
  const dayDate = req.body.date;
  try {
    const day = await getSingleDay(dayDate, courseCode);
    return res.status(200).json(day);
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};


