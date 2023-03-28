import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface IDays {
  dayNumber?: Number;
  Date?: Date;
  events?: string[];
  mentorName?:string;
  mentorPhone?:string;
  address?:string;
  hours?:string[];
  attendance?:[{studentName:string, status:number}];
  dailyClassRoom?:string;
  googleMeet?:string;
}

export const daysSchema = new Schema<IDays>({
  dayNumber: { type: Number, required: true },
  Date: { type: Date, required: true },
  events: [String],
  mentorName: {type:String},
  mentorPhone: {type:String},
  address:{type:String},
  hours:{type:String},
  attendance:[{studentName:{type:String}, status:{type:Number}}],
  dailyClassRoom:{type:String},
  googleMeet:{type:String},
});

export const DaysModel = mongoose.model<IDays>("days", daysSchema);
