import { IUser, UserModel } from "../models/users.model";

export const registerUser = async(user:IUser)=>{
    try {
        const _user = new UserModel(user);
        await _user.save();
        return _user;
      }
     catch (err) {
      console.log(err);
      throw err;
    }
}