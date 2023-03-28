import { Request, Response } from "express";
import { CourseModel } from "../models/course.model";
import { UserModel } from "../models/users.model";
import bcrypt from "bcrypt";
import { registerUser } from "../services/user.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import config from "../config/config";



export const registerNewUser = async (req: Request, res: Response) => {
  try {
    // user inputs
    const { name, lastName, email, password, phone, role, course } = req.body;
    if (!(email && password && name && lastName)) {
      res.status(400).send("All input is required");
    }

    const usersApproved = await CourseModel.find();
    const userRegistered = await UserModel.findOne({ email: email });
    // checking if there is a user with this mail
    if (userRegistered) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    // checking if this student is approved for this course
    if (!usersApproved.find((user) => user.expectedUsers === email)) {
      return res.status(409).send("User Not approved for this course");
    }
    // hashing the user password
    const encryptedPassword =
      password !== undefined ? await bcrypt.hash(password, 10) : "err";

    // sending the user data to the service

    const user = {
      name: name,
      lastName: lastName,
      phone: phone,
      email: email,
      password: encryptedPassword,
      course: course,
      role: role,
    };
    registerUser(user);
    return res.status(200).json({
      status: 201,
      data: user,
      message: "Successfully Create User",
    });
  } catch (err) {
    console.log(err);
  }
};

export const logInUser = async (req: Request, res: Response) => {

  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await UserModel.findOne({ email: email });
    const userToReturn = await UserModel.findOne({ email: email }).select('-password -phone');
// check that the user insert all inputs
    if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      
    if(user &&(await bcrypt.compare(password, user.password))){
        // Create token
      const token = jwt.sign(
        {
            email: user.email,
            role: user.role,
            course: user.course
          },
         config.secretKey ,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      return res.status(200).json({
        message: "Auth successful",
        token,
        user: userToReturn,
      });
    }
    res.status(400).send("Invalid Credentials");
  } catch (error:any) {
    return res.status(500).json({
        message: error.message,
        error,
      });
  }
};



