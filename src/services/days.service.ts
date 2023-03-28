import { DaysModel, IDays } from "../models/days.model";


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
  