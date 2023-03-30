import { AttendanceModel, IAttendance } from "../models/attendance.model";
import { IDays } from "../models/days.model";

export const pushingDaysDate = async (daysArray: IAttendance[]) => {
  try {
    const _daysArray = await AttendanceModel.insertMany(daysArray);
    if (_daysArray) {
      return _daysArray;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateAttendance = async (
  courseCode: string,
  date: string,
  userEmail: string,
  status: number
) => {
  try {
    //
    const specificDay = await AttendanceModel.findOne({
      date: date,
      courseCode: courseCode,
    });
    if (specificDay?.attendance?.find((obj) => obj.studentName === userEmail)) {
      for (let i = 0; i < specificDay.attendance.length; i++) {
        if (specificDay.attendance[i].studentName === userEmail) {
          const specificDay = await AttendanceModel.findOneAndUpdate({date: date,courseCode: courseCode}, {$set:{attendance:{studentName:userEmail, status:status}}})
          break;
        }
      }
      await specificDay.save();
      console.log(specificDay.attendance);
      return specificDay;
    } else {
      const specificDay = await AttendanceModel.findOneAndUpdate(
        { date: date, courseCode: courseCode },
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

export const singleDayAttendance = async (
  courseCode: string,
  dayDate: string,
  role: string,
  email: string
) => {
  try {
    if (role === "user") {
      const specificDay: IAttendance | null = await AttendanceModel.findOne({
        courseCode: courseCode,
        date: dayDate,
      });
      const userStatus = specificDay?.attendance?.map(
        (day: any) => day.studentName === email
      );
      return userStatus;
    } else if (role === "admin") {
      const specificDay: IAttendance | null = await AttendanceModel.findOne({
        courseCode: courseCode,
        date: dayDate,
      });
      const classAttendanceStatus = specificDay?.attendance;
      return classAttendanceStatus;
    }
  } catch (error) {
    console.log(error);
  }
};

export const allDaysAttendance = async (
  courseCode: string,
  role: string,
  email: string
) => {
  try {
    if (role === "user") {
      const specificCourse: IAttendance[] = await AttendanceModel.find({
        courseCode: courseCode,
      });
      for (let i = 0; i < specificCourse.length; i++) {
        const dayAttendance = specificCourse[i].attendance || [];
        const userStatus = dayAttendance.filter(
          (e: any) => e.studentName === email
        );
        return userStatus;
      }
    } else if (role === "admin") {
      const specificCourse: IAttendance[] = await AttendanceModel.find({
        courseCode: courseCode,
      });
      return specificCourse;
    }
  } catch (error) {
    console.log(error);
  }
};
