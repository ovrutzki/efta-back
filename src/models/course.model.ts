import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface ICourse {
  startingDate?: string;
  endingDate?: string;
  admin?: string;
  classRoomLink?: string;
  mondayData?: string;
  courseCode?:string;
}

export const courseSchema = new Schema<ICourse>({
  startingDate: { type: String },
  endingDate: { type: String },
  admin: { type: String },
  classRoomLink: { type: String },
  mondayData: {type:String},
  courseCode:{type:String},
  
});

export const CourseModel = mongoose.model<ICourse>("courses", courseSchema);

