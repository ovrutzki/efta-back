import { AttendanceModel, IAttendance } from "../models/attendance.model";
import { IUser, UserModel } from "../models/users.model";
import emailFunction from "./emailBuilder";

export interface IStudent {
  studentName?: string;
  phone?: string;
  status?: number;
}
export const emailSender = async () => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const tomorrowStep = tomorrow.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const tomorrowString = tomorrowStep.replace(/\//g, "-");

  const adminsArray: IUser[] = await UserModel.find({ role: "admin" });
  let usersNotCome:any = [];
  for (let i = 0; i < adminsArray.length; i++) {
    const adminCourseDay: IAttendance[] =
      (await AttendanceModel.find({
        courseCode: adminsArray[i].courseCode,
        date: tomorrowString,
      })) || [];

    const specificDate = new Date(adminCourseDay[0]?.date);
    for (let j = 0; j < adminCourseDay[0]?.attendance.length; j++) {
        
        console.log(adminCourseDay[0]?.attendance[j]);
        
        if (adminCourseDay[0]?.attendance[j].status === -1) {
            usersNotCome.push(adminCourseDay[0]?.attendance[j].studentName)
        } 
    }
        

    if (usersNotCome && usersNotCome?.length > 2) {
      if (
        specificDate.getFullYear() === tomorrow.getFullYear() &&
        specificDate.getMonth() === tomorrow.getMonth() &&
        specificDate.getDate() === tomorrow.getDate()
      ) {
        console.log(adminsArray[i]);
        
        emailFunction(adminsArray[i], usersNotCome);
      }
    }
  }
};
