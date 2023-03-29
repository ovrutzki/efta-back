import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import config from "../config/config";

dotenv.config()

export const authCheck = (permissions: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers.authorization?.split(" ")[1] || "";
        const decodedToken:any = jwt.verify(token, config.secretKey);
        const userRole = decodedToken?.role;

        // get token exp time and the current time to check if the token is valid
        const tokenExp = decodedToken?.exp;
        const currentTime = Math.floor(Date.now() / 1000); 

        if (permissions.includes(userRole) &&  tokenExp > currentTime) {
            next();
        } else {
          return res.status(401).json("you don`t have permission for this action");
        }
      

   
  };
};

