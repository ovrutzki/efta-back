import { IAttendance } from "../interface";
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
  try {
    if (await DaysModel.find()) {
      const _daysArray = DaysModel.updateMany(daysArray)
      return _daysArray;
    }
    const _daysArray = DaysModel.insertMany(daysArray);
    return _daysArray;
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
