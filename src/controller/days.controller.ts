import express, { Request, Response } from "express";
import { getDays } from "../services/days.service";

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