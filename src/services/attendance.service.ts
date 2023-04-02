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
  status: number,
  phone:string
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
          const specificDay = await AttendanceModel.findOneAndUpdate({date: date,courseCode: courseCode}, {$set:{attendance:{studentName:userEmail,phone:phone, status:status}}})
          break;
        }
      }
      await specificDay.save();
      console.log(specificDay.attendance);
      return specificDay;
    } else {
      const specificDay = await AttendanceModel.findOneAndUpdate(
        { date: date, courseCode: courseCode },
        { $push: { attendance: { studentName: userEmail,phone:phone, status: status } } }
      );

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
      const userAttendanceArray = []
      for (let i = 0; i < specificCourse.length; i++) {
        const dayAttendance = specificCourse[i].attendance;
        const userStatus = dayAttendance?.filter(
          (e: any) => e.studentName === email
        );
        const userDayAttendance = {
          date:specificCourse[i].date,
          userStatus:userStatus
        }
        userAttendanceArray.push(userDayAttendance)
      }
      console.log("userAttendanceArray",userAttendanceArray);
      
      return userAttendanceArray;
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

export const updateCourseDaysFromMonday = async (dateArray:string[],courseCode:string) =>{
    const daysInCollection:IAttendance[] = await AttendanceModel.find({courseCode:courseCode})
    const daysFromMonday = dateArray
    console.log(dateArray);
    let arrayToAdd:string[] = []; 
    const arrayToCollection = []
  try {
    if(daysInCollection.length > 0){
      for (let i = 0; i < daysInCollection.length; i++) {
        arrayToAdd =  daysFromMonday.filter((date) => date !== daysInCollection[i].date)
      }
    } else if (daysInCollection.length === 0){
      arrayToAdd = daysFromMonday
    }

    for (let j = 0; j < arrayToAdd.length; j++) {
      arrayToCollection.push({
        courseCode:courseCode,
        date:arrayToAdd[j],
        attendance: [{}]
      })
    }
   
    console.log("arrayToAdd",arrayToCollection);
    
    const _dayToAdd = await AttendanceModel.insertMany(arrayToCollection);
  
  } catch (error) {
   console.log(error);
    
  }
}


export const addUserToAttendance = async (email:string,phone:string,courseCode:string) => {
  try {
    const courseDays = await AttendanceModel.updateMany({courseCode:courseCode},{$push:{attendance:{
      studentName:email,
      phone:phone,
      status:0
    }}})
    
  } catch (error) {
    console.log(error);
    
  }
}