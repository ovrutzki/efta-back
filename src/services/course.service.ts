import { CourseModel } from "../models/course.model";

export const addingMondayData = async (name: string, inputData: any) => {
  try {
    const _mondayData = await CourseModel.findOneAndUpdate(
      { courseName: name },
      { $set: { mondayData: inputData } }
    );
    if (_mondayData) {
      return _mondayData;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getTokenFromDB = async () => {
  try {
    const course = await CourseModel.findOne({ courseName: "moveobootcamp" });
    const token = course && course.mondayData;
    return token;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
