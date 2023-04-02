import axios from "axios";
import { Request, Response } from "express";
import { CourseModel, ICourse } from "../models/course.model";
import { IDays } from "../models/days.model";
import { updateCourseDaysFromMonday } from "../services/attendance.service";
import { getTokenFromDB } from "../services/course.service";
import { deleteAllDays, deleteDaysByCourseCode, pushingDaysArrayToDb } from "../services/days.service";
import { getMondayToken } from "./course.controller";
const cron = require("node-cron");
const moment = require('moment-timezone');


export const getAllData = async (req: Request, res: Response) => {
  let UserToken = req.headers.authorization?.split(" ")[1];
  const userTokenDecoded =
    UserToken &&
    JSON.parse(Buffer.from(UserToken.split(".")[1], "base64").toString());
  const courseCode = userTokenDecoded.courseCode;
  // taking the board Id and the secret monday token:

  const mondayDbToken = await getTokenFromDB(courseCode);
  console.log('mondayDbToken', mondayDbToken);

  const tokenDeCoded = mondayDbToken && JSON.parse(Buffer.from(mondayDbToken.split(".")[1], "base64").toString());

  console.log('tokenDeCoded', tokenDeCoded);
  
  const mondaySecretToken = tokenDeCoded.mondayToken;
  
  const boardId = tokenDeCoded.boardId;
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
        .then((result: any) => {
          return result.data.data.boards;
        })
        .catch((error: any) => {
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
console.log("mondayData", mondayData);

  // sending data to the data base:

  const sendingDataToDB = async () => {
    const daysArray: IDays[] = [];
    const dateArrayForAttendance = [];
    try {
      for (let i = 0; i < mondayData.length; i++) {
        
        let item = mondayData[i];
        console.log(" item.column_values[4].text", item.column_values[5].text);
        // changing the date format:
        const dateAsArray =  item.column_values[5].text.split(" ");

        const beginningDate = dateAsArray[0] 
        const endingDate = dateAsArray[2]

        // array of days for one item:
          const dates = [];
          let currentDate = new Date(beginningDate);
          const end = new Date(endingDate);
        
          while (currentDate <= end) {
            dates.push(currentDate.toISOString().substring(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        console.log(dates);
        // '2023-03-27', '2023-03-28', '2023-03-29' ]
      
 
        // changing the phone format:
        const phoneNumArray = item.column_values[20].text
          .split("")
          .filter((e: string) => e !== "-");
        const fiveIndex = phoneNumArray.findIndex((e: string) => e === "5");
        const phoneTransform = phoneNumArray.slice(fiveIndex).join("");

        // changing the hours format:
        const hoursArray = item.column_values[8].text.split("-");

        // creating a single day document:

          for (let j = 0; j < dates.length; j++) {
                
            const splittedDate = dates[j].split('-')

            const beginningDateTransform = `${splittedDate[1]}-${splittedDate[2]}-${splittedDate[0]}`
            const singleDay: IDays = {
              events: [{ eventName: item.name, link: item.column_values[11].text }],
              dayNumber: item.column_values[6].text,
              date: beginningDateTransform,
              mentorPhone: phoneTransform,
              mentorName:
                item.column_values[21].text === "Guest lecturer"
                  ? ""
                  : item.column_values[1].text,
              address: item.column_values[19].text,
              hours: hoursArray,
              dailyClassRoom: item.column_values[16].text,
              googleMeet: item.column_values[17].text,
              guestLecturer:
                item.column_values[18].text === "Guest lecturer" ? true : false,
              courseCode: courseCode,
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
  
  
          // pushing the items date to dteArrayForAttendance:
          dateArrayForAttendance.push(beginningDateTransform) 

            
          }
      }
 
      updateCourseDaysFromMonday(dateArrayForAttendance, courseCode)
      console.log(courseCode);
      
      deleteDaysByCourseCode(courseCode);
      
      pushingDaysArrayToDb(daysArray);
    } catch (error) {
      console.log(error);
    }
  };
  setTimeout(sendingDataToDB, 2000);
};

export const updatingAllDays = async () => {
  // deleting al days from data base:
  deleteAllDays();
  // getting all courses from data base, then taking the relevant monday data (secret token + board id)
  const allCourses: ICourse[] = await CourseModel.find();
  for (let i = 0; i < allCourses.length; i++) {
    const courseCode = allCourses[i].courseCode;
    const mondayDataToken = allCourses[i].mondayData;
    const tokenDeCoded =
      mondayDataToken &&
      JSON.parse(
        Buffer.from(mondayDataToken.split(".")[1], "base64").toString()
      );

    const mondaySecretToken = tokenDeCoded.mondayToken;
    const boardId = tokenDeCoded.boardId;

    // making a request to the monday api for each course:
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
          .then((result: any) => {
            return result.data.data.boards;
          })
          .catch((error: any) => {
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
          const dateAsArray = item.column_values[4].text.split("-");
          const dateTransform = `${dateAsArray[1]}-${dateAsArray[2]}-${dateAsArray[0]}`;

          // changing the phone format:
          const phoneNumArray = item.column_values[19].text
            .split("")
            .filter((e: string) => e !== "-");
          const fiveIndex = phoneNumArray.findIndex((e: string) => e === "5");
          const phoneTransform = phoneNumArray.slice(fiveIndex).join("");

          // changing the hours format:
          const hoursArray = item.column_values[7].text.split("-");

          const singleDay: IDays = {
            events: [
              { eventName: item.name, link: item.column_values[10].text },
            ],
            dayNumber: item.column_values[5].text,
            date: dateTransform,
            mentorPhone: phoneTransform,
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
            courseCode: courseCode,
          };
          const existingDay = daysArray.find(
            (day) => day.date === singleDay.date
          );
          if (singleDay.guestLecturer) {
            if (existingDay) {
              singleDay.events &&
                existingDay?.events?.push(singleDay.events[0]);
            } else {
              daysArray.push(singleDay);
            }
          } else if (existingDay) {
            singleDay.events && existingDay?.events?.push(singleDay.events[0]);
          } else {
            daysArray.push(singleDay);
          }
        }

        pushingDaysArrayToDb(daysArray);
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(sendingDataToDB, 2000);
  }
};


// executing the function every midnight:
cron.schedule('0 0 * * *', function() {
  updatingAllDays()

  // console.log("hello");
  
}, {
  timezone: 'Israel'
});


