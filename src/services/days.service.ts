import { IAttendance } from "../interface";
import { DaysModel, IDays } from "../models/days.model";


export const deleteAllDays = async () => {
  try {
    const _daysArray = DaysModel.deleteMany({})
    return _daysArray;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const pushingDaysArrayToDb = async (daysArray: IDays[]) => {
  
    try {
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

  export const updateAttendance = async (date:string, userEmail:string, status:number ) => {
    try {
      const _attendance = await DaysModel.findOneAndUpdate({date:date},{$push:{attendance:{studentName:userEmail,status:status}}});
      if (_attendance) {
        return _attendance;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  // export const updateAttendance = async (date:string, userEmail:string, status:number ) => {
  //   try {
  //     const _attendance = await DaysModel.findOneAndUpdate({date:date},{$push:{attendance:{studentName:userEmail,status:status}}});
  //     if (_attendance) {
  //       return _attendance;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // };
  