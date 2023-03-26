import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  UserNotification?: {};
  AdminNotification?: {};
  course: string;
  attendance?: [{ date: Date; status: number }];
}

export const userSchema = new Schema<IUser>({
  name: { type: String },
  lastName: { type: String },
  password: { type: String },
  email: { type: String, lowercase: true, unique: true },
  phone: { type: Number },
  role: { type: String, default: "user" },
  UserNotification: { type: Object },
  AdminNotification: { type: Object },
  course: { type: String },
  attendance: [{ date: { type: Date }, status: { type: Number } }],
});

export const UserModel = mongoose.model<IUser>("users", userSchema);
