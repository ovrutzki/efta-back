import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { StringLiteral } from "typescript";

export interface ICourse {
  users: string[];
  startingDate: Date;
  endingDate: Date;
  courseName: string;
  admin: string;
  classRoomLink: string;
}

export const courseSchema = new Schema<ICourse>({
  users: [String],
  startingDate: { type: Date },
  endingDate: { type: Date },
  courseName: { type: String },
  admin: { type: String },
  classRoomLink: { type: String },
});

export const CourseModel = mongoose.model<ICourse>("course", courseSchema);
