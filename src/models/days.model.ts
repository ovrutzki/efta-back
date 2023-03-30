import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface IDays {
  dayNumber?: Number;
  date: string;
  events?: [{eventName:string, link:string}];
  mentorName?:string;
  mentorPhone?:string;
  address?:string;
  hours?:string[];
  dailyClassRoom?:string;
  googleMeet?:string;
  guestLecturer?:boolean;
  courseCode?:string
}

export const daysSchema = new Schema<IDays>({
  dayNumber: { type: Number, default:1},
  date: { type: String },
  events: [{eventName:{type:String}, link:{type:String}}],
  mentorName: {type:String},
  mentorPhone: {type:String},
  address:{type:String},
  hours:[String],
  dailyClassRoom:{type:String},
  googleMeet:{type:String},
  guestLecturer:{type:Boolean},
  courseCode:{type:String},
});

export const DaysModel = mongoose.model<IDays>("days", daysSchema);
