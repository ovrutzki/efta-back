import axios from "axios";
import { Request, response, Response } from "express";
import { IDays } from "../models/days.model";
import { getMondayToken } from "./course.controller";

export const getAllData = async (req: Request, res: Response) => {
  const token = await getMondayToken(res);
  const tokenInCoded =
    token && JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  const mondaySecretToken = tokenInCoded.mondayToken;

  //  sending a request to get course data with the monday token to monday api
  const mondayAuthAndData = async () => {
    try {
      const theData = await axios({
        url: "https://api.monday.com/v2",
        method: "POST",
        data: {
          query: `query { boards( ids: [4190641229]) { name id items { name column_values {
                    title
                     text
                        }}}}`,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${mondaySecretToken}`,
        },
      })
        .then((result) => {
          return result.data.data.boards;
        })
        .catch((error) => {
          console.log(error);
        });
      return theData;
    } catch (error) {
      console.log(error);
    }
  };
  //   course data!!
  const mondayBoard = await mondayAuthAndData();
  const mondayData = mondayBoard[0].items

  // sending data to the data base:

  const sendingDataToDB = async () => {
    const daysArray:IDays[] = [];
    const singleDay:IDays = {}
    // console.log('1', mondayData);
    
    try {
        for(let item of mondayData){
            // console.log("item",item);
            singleDay.events = item.name;
            for (let i = 0; i< item.column_values.length; i++) {
                console.log(item.column_values[i], 'i :' + i);
            } 
            singleDay.mentorName = item.column_values[1].text;
            singleDay.dayNumber = item.column_values[5].text;
        }

      mondayData.map((item: any) => {
        if (item.column_values[4].title === "Date") {
          const itemDay = item.column_values[4].text.split("-" || " ");
          const subjectStart = `${itemDay[2]}-${itemDay[1]}-${itemDay[0]}`;
          const subjectEnd = `${itemDay[5]}-${itemDay[4]}-${itemDay[3]}`;
          const subjectDays = itemDay[5] - itemDay[2] + 1;
          
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  setTimeout(sendingDataToDB, 4000);
};
