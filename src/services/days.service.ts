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