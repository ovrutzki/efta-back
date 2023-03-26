import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export interface IDays {
  dayNumber: Number;
  Date: Date;
  subject?: string[];
  events?: string[];
}

export const daysSchema = new Schema<IDays>({
  dayNumber: { type: Number, required: true },
  Date: { type: Date, required: true },
  subject: [String],
  events: [String],
});

export const DaysModel = mongoose.model<IDays>("days", daysSchema);
