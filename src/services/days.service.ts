import { IAttendance } from "../interface";
import { CourseModel } from "../models/course.model";
import { DaysModel, IDays } from "../models/days.model";

export const deleteAllDays = async () => {
  try {
    console.log("deleteMany");
    
    await DaysModel.deleteMany({});
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const deleteDaysByCourseCode = async (courseCode:string) => {
  try {
    const _daysArray = await DaysModel.deleteMany({courseCode:courseCode});
    return _daysArray;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const pushingDaysArrayToDb = async (daysArray: IDays[]) => {
  try {    
    const array = daysArray
    // console.log("assaf",daysArray.length);
    // console.log("assaf arr",daysArray);
    
    for(let i = 0; i < array.length ; i++ ){
      const _DayArray = new DaysModel(array[i]);
      await _DayArray.save()

      // console.log(`checking ${i}`, array[i])
    }
        
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getDays = async (code:string) => {
  try {
    const days = await DaysModel.find({courseCode:code});
    return days;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSingleDay = async (dayDate:string,code:string) => {
  try {
    const day = await DaysModel.findOne({date:dayDate, courseCode:code });
    return day;
  } catch (err) {
    console.log(err);
    throw err;
  }
};


// export const oldOldpushingDaysArrayToDb = async (daysArray: IDays[]) => {
//   try {
//     for(let i = 0; i < daysArray.length; i++){
//       if(await DaysModel.findOne({date:daysArray[i].date})){
//         console.log("if",daysArray[i].date);
//         const _existingDay = DaysModel.findOneAndUpdate({date:daysArray[i].date},{$set:daysArray[i]});
//         // return _existingDay
//       } else {
//         console.log( "else",daysArray[i].date);
//         const _singleDay = new DaysModel(daysArray[i]);
//         _singleDay.save();
//     //  return _singleDay;
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

