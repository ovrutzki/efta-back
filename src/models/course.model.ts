import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface ICourse {
  expectedUsers: string[];
  startingDate: Date;
  endingDate: Date;
  courseName: string;
  admin: string;
  classRoomLink: string;
  mondayData: string;
  courseCode:string;
}

export const courseSchema = new Schema<ICourse>({
  expectedUsers: [String],
  startingDate: { type: Date },
  endingDate: { type: Date },
  courseName: { type: String ,lowercase: true},
  admin: { type: String },
  classRoomLink: { type: String },
  mondayData: {type:String},
  courseCode:{type:String}
});

export const CourseModel = mongoose.model<ICourse>("course", courseSchema);


// {
//   client_id: {type:String},
//   client_secret:  {type:String},
//   signing_secret:  {type:String},
//   app_id:  {type:String},
//   mondayToken: {type:String}}

// {
//   client_id: string;
//   client_secret: string;
//   signing_secret: string;
//   app_id: string;
//   mondayToken:string
// };