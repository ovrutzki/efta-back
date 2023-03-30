import { IAttendance } from "../models/attendance.model";
import { AttendanceModel } from "../models/attendance.model";


export const pushingDaysDate = async (daysArray: IAttendance[]) => {
    try {
      const _daysArray = await AttendanceModel.insertMany(daysArray)
      if(_daysArray){
        return _daysArray
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  export const updateAttendance = async (
    courseCode:string,
    date: string,
    userEmail: string,
    status: number
  ) => {
    try {
        // 
      const specificDay = await AttendanceModel.findOne({ date: date, courseCode:courseCode });
      if (specificDay?.attendance?.find((obj) => obj.studentName === userEmail)) {
        for (let i = 0; i < specificDay.attendance.length; i++) {
          if (specificDay.attendance[i].studentName === userEmail) {
            specificDay.attendance[i].status = status;
            break;
          }
        }
        await specificDay.save();
        console.log(specificDay.attendance);
        return specificDay;
      } else {
        const specificDay = await AttendanceModel.findOneAndUpdate(
          { date: date ,courseCode:courseCode },
          { $push: { attendance: { studentName: userEmail, status: status } } }
        );
        console.log("push");
  
        return specificDay;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };