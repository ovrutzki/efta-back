import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface IAttendance {
  courseCode: string;
  date: string;
  attendance: [{ studentName?: string,phone?:string, status?: number }];
}

export const attendanceSchema = new Schema<IAttendance>({
  courseCode: { type: String },
  date: { type: String },
  attendance: [{ studentName: { type: String },phone:{type:String}, status: { type: Number } }],
});

export const AttendanceModel = mongoose.model<IAttendance>(
  "attendance",
  attendanceSchema
);
