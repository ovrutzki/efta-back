import { IAttendance } from "../interface";
import { CourseModel } from "../models/course.model";
import { DaysModel, IDays } from "../models/days.model";

export const deleteAllDays = async () => {
  try {
    const _daysArray = DaysModel.deleteMany({});
    return _daysArray;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const pushingDaysArrayToDb = async (daysArray: IDays[]) => {
  console.log("11111111111111");
  try {
    for(let i = 0; i < daysArray.length; i++){
      if(await DaysModel.findOne({date:daysArray[i].date})){
        console.log("if",daysArray[i].date);
        const _existingDay = DaysModel.updateOne({date:daysArray[i].date},{$set:daysArray[i]});
        // return _existingDay
      } else {
        console.log( "else",daysArray[i].date);
        const _singleDay = new DaysModel(daysArray[i]);
        _singleDay.save();
    //  return _singleDay;
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getDays = async () => {
  try {
    const days = await DaysModel.find();
    return days;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSingleDay = async (dayDate:string) => {
  try {
    const day = await DaysModel.findOne({date:dayDate});
    return day;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateAttendance = async (
  date: string,
  userEmail: string,
  status: number
) => {
  try {
    const _attendance = await DaysModel.findOne({ date: date });
    if (_attendance?.attendance?.find((stu) => stu.studentName === userEmail)) {
      for (let i = 0; i < _attendance.attendance.length; i++) {
        if (_attendance.attendance[i].studentName === userEmail) {
          _attendance.attendance[i].status = status;
          break;
        }
      }
      await _attendance.save();
      console.log(_attendance.attendance);
      return _attendance;
    } else {
      const _attendance = await DaysModel.findOneAndUpdate(
        { date: date },
        { $push: { attendance: { studentName: userEmail, status: status } } }
      );
      console.log("push");

      return _attendance;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const test = async (date: string, userEmail: string, status: number) => {
  try {
    const _attendance = await DaysModel.findOneAndUpdate(
      { date: date },
      { attendance: { studentName: userEmail, status: status } }
    );
    if (_attendance) {
      return _attendance;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
