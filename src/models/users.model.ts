import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
 
export interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  UserNotification?: {};
  AdminNotification?: {};
  courseCode: string;
  // attendance?: [{ date: Date; status: number }];
}

export const userSchema = new Schema<IUser>({
  name: { type: String,lowercase: true },
  lastName: { type: String,lowercase: true },
  password: { type: String },
  email: { type: String, lowercase: true, unique: true },
  phone: { type: String },
  role: { type: String, default: "user" },
  UserNotification: { type: Object },
  AdminNotification: { type: Object },
  courseCode: { type: String},
  // attendance: [{ date: { type: Date }, status: { type: Number } }],
});

export const UserModel = mongoose.model<IUser>("users", userSchema);
