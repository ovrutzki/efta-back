import { CourseModel, ICourse } from "../models/course.model";

export const courseCreation = async (
  courseCode: string,
  courseData: ICourse
) => {
  try {
    const courseArray = await CourseModel.find({ courseCode: courseCode });

    if (courseArray.length > 0) {
      console.log("if", courseData);
      const _courseData = await CourseModel.findOneAndUpdate(
        { courseCode: courseCode },
        { $set:  courseData  }
      );
      if (_courseData) {
        return _courseData;
      }
    } else {
      console.log("else", courseData);
      const _courseData = new CourseModel(courseData);
         _courseData.save();
      return _courseData;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getTokenFromDB = async (corseCode:string) => {
  try {
    const course = await CourseModel.findOne({ courseCode: corseCode });
    const token = course && course.mondayData;
    return token;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
