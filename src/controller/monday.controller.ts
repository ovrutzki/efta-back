import axios from "axios";
import { Request, Response } from "express";
import { IDays } from "../models/days.model";
import { deleteAllDays, pushingDaysArrayToDb } from "../services/days.service";
import { getMondayToken } from "./course.controller";

export const getAllData = async (req: Request, res: Response) => {
  let UserToken = req.headers.authorization?.split(' ')[1] ;
  const userTokenDecoded =UserToken && JSON.parse(Buffer.from(UserToken.split('.')[1], 'base64').toString());
  const corseCode = userTokenDecoded.courseCode
  // taking the board Id and the secret monday token:
  console.log("corseCode-",corseCode);
  
  const mondayDbToken = await getMondayToken(corseCode,res);
  console.log("mondayDbToken", mondayDbToken);
  
  const tokenDeCoded =
  mondayDbToken && JSON.parse(Buffer.from(mondayDbToken.split(".")[1], "base64").toString());
  
  console.log("tokenDeCoded", tokenDeCoded);
  const mondaySecretToken = tokenDeCoded.mondayToken;
  const boardId = tokenDeCoded.boardId
  //  sending a request to get course data with the monday token to monday api
  const mondayAuthAndData = async () => {
    try {
      const theData = await axios({
        url: "https://api.monday.com/v2",
        method: "POST",
        data: {
          query: `query { boards( ids: [${boardId}]) { name id items { name column_values {
                    title
                     text
                        }}}}`,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${mondaySecretToken}`,
        },
      })
        .then((result:any) => {
          return result.data.data.boards;
        })
        .catch((error:any) => {
          console.log(error);
        });
      return theData;
    } catch (error) {
      console.log(error);
    }
  };
  //   course data!!
  const mondayBoard = await mondayAuthAndData();
  const mondayData = mondayBoard[0].items;

  // sending data to the data base:

  const sendingDataToDB = async () => {
    const daysArray: IDays[] = [];

    try {
      for (let i = 0; i < mondayData.length; i++) {
        let item = mondayData[i];
        // changing the date format:
        const dateAsArray = (item.column_values[4].text).split('-')
        const dateTransform = `${dateAsArray[1]}-${dateAsArray[2]}-${dateAsArray[0]}`

        // changing the phone format:
        const phoneNumArray = item.column_values[19].text.split("").filter((e:string)=> e!== "-")
        const fiveIndex = phoneNumArray.findIndex((e:string)=> e==='5')
        const phoneTransform = phoneNumArray.slice(fiveIndex).join("");
        
        // changing the hours format:
        const hoursArray = item.column_values[7].text.split('-');
        
        const singleDay: IDays = {
          events: [{ eventName: item.name, link: item.column_values[10].text }],
          dayNumber: item.column_values[5].text,
          date: dateTransform,
          mentorPhone:phoneTransform,
          mentorName:
            item.column_values[17].text === "Guest lecturer"
              ? ""
              : item.column_values[0].text,
          address: item.column_values[18].text,
          hours: hoursArray,
          dailyClassRoom: item.column_values[15].text,
          googleMeet: item.column_values[16].text,
          guestLecturer:
            item.column_values[17].text === "Guest lecturer" ? true : false,
        };
        const existingDay = daysArray.find(
          (day) => day.date === singleDay.date
        );
        if (singleDay.guestLecturer) {
          if (existingDay) {
            singleDay.events && existingDay?.events?.push(singleDay.events[0]);
          } else {
            daysArray.push(singleDay);
          }
        } else if (existingDay) {
          singleDay.events && existingDay?.events?.push(singleDay.events[0]);
        } else {
          daysArray.push(singleDay);
        }
      }
      // deleteAllDays();
      pushingDaysArrayToDb(daysArray);
    } catch (error) {
      console.log(error);
    }
  };
  setTimeout(sendingDataToDB, 3000);
};

