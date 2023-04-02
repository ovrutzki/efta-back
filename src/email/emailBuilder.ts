//batchSend.js
import dotenv from "dotenv";
import { IAttendance } from "../models/attendance.model";
import { IUser } from "../models/users.model";
import { getAllUsers } from "../services/user.service";
import { IStudent } from "./mailSender";
const Sib = require("sib-api-v3-sdk");

dotenv.config();

const emailFunction = async (admin: IUser, studentArray:[]) => {
   console.log("test");

  const receivers = [];
  const usersEmails: IUser[] = (await getAllUsers()) || [];
  for (let i = 0; i < usersEmails.length; i++) {
    const user = {
      email: admin.email,
    };
    receivers.push(user);
  }
  const client = Sib.ApiClient.instance;
  const apiKey: any = client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_KEY;
  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "moveochamp@gmail.com",
  };
  tranEmailApi
    .sendTransacEmail({
      sender,
      to:receivers,
      subject: "attendance status",
      textContent:`hello`,
      htmlContent: `
   <h1>EFTA</h1>
<h2>hello ${admin.name}</h2>
<p>You are receiving this email because an unusual number of students are not coming tomorrow </p>
<p>the students are: ${studentArray}</p>
   `,
    })
    .then(console.log("seee"))
    .catch((err: any) => console.log(err));
};

export default emailFunction;
