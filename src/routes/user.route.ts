import express, { Request, Response } from "express";
import { registerNewUser, logInUser } from "../controller/user.controller";


const userRouter = express.Router();

// userRouter.get("/", getAllUsers);

userRouter.post('/signUp',registerNewUser );

userRouter.post('/logIn',logInUser );




export default userRouter;

