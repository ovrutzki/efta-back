import express, { Request, Response } from "express";
import { getDays, updateAttendance } from "../services/days.service";

export const getAllDays = async (req: Request, res: Response) => {
    try {
      const days = await getDays();
      return res
        .status(200)
        .json(days);
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };

  export const attendanceUpdate =  async (req: Request, res: Response) => {
    let token = req.headers.authorization?.split(' ')[1] ;
    const userEmail =token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).email;
    const {date, status} = req.body
    try {
      const attendance = updateAttendance(date, userEmail, status);
      return res
        .status(200)
        .json({
          status: 200,
          data: attendance,
          message: "Successfully Update attendance",
        });
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };