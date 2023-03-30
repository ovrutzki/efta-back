import { Request, Response } from "express";
import { CourseModel } from "../models/course.model";
import { UserModel } from "../models/users.model";
import bcrypt from "bcrypt";
import { registerUser } from "../services/user.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import config from "../config/config";


dotenv.config()
export const registerNewUser = async (req: Request, res: Response) => {
  try {
    // user inputs
    const { name, lastName, email, password, phone, code } = req.body;
    let role = "user"
    if (!(email && password && name && lastName && code)) {
      res.status(400).send("All input is required");
    }
console.log(typeof process.env.ADMIN_CODE);
console.log(typeof code);

    if (code === process.env.ADMIN_CODE) {
        role="admin";
   } else {
     const course = await CourseModel.findOne({courseCode:code}) || false;
     // checking if this student is approved for this course
     if (!course) {
       return res.status(409).send("User Not approved for this course");
     }
      const userRegistered = await UserModel.findOne({ email: email });
      // checking if there is a user with this mail
      if (userRegistered) {
        return res.status(409).send("User Already Exist. Please Login");
      }
   }
   // changing the phone format:
   const phoneNumArray = phone.split("").filter((e:string)=> e!== "-")
   const fiveIndex = phoneNumArray.findIndex((e:string)=> e==='5')
   const phoneTransform = phoneNumArray.slice(fiveIndex).join("");


    // hashing the user password
    const encryptedPassword =
      password !== undefined ? await bcrypt.hash(password, 10) : "err";

    // sending the user data to the service

    const user = {
      name: name,
      lastName: lastName,
      phone: phoneTransform,
      email: email,
      password: encryptedPassword,
      courseCode: role==="admin" ? "" : code,
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
    const userToReturn = await UserModel.findOne({ email: email }).select('-password');
    

    let isAdmin = false;
    let haveCourse = false;
    console.log('test ',(await CourseModel.findOne({admin:email})));

// check if the user is admin:
    if(user?.role === "admin"){
      isAdmin = true;
       if(await CourseModel.findOne({admin:email})){
        haveCourse = true
       } else {
        isAdmin = true;
        haveCourse = false
       }
    }
// check if the admin have a course in the data base
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
            courseCode: user.courseCode
          },
         config.secretKey ,
        {
          expiresIn: "2h",
        }
      );

      // return to front user token
      return res.status(200).json({
        message: "Auth successful",
        token,
        user: userToReturn,
        admin: isAdmin,
        haveCourse: haveCourse
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



