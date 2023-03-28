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
  attendance?:[{studentName:string, status:number}];
  dailyClassRoom?:string;
  googleMeet?:string;
  guestLecturer?:boolean
}

export const daysSchema = new Schema<IDays>({
  dayNumber: { type: Number},
  date: { type: String },
  events: [{eventName:{type:String}, link:{type:String}}],
  mentorName: {type:String},
  mentorPhone: {type:String},
  address:{type:String},
  hours:[String],
  attendance:[{studentName:{type:String}, status:{type:Number}}],
  dailyClassRoom:{type:String},
  googleMeet:{type:String},
  guestLecturer:{type:Boolean},
});

export const DaysModel = mongoose.model<IDays>("days", daysSchema);
