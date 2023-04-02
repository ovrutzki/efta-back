import express from "express";
import routes from "./routes/index";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDB } from "./connection";
import { emailSender } from "./email/mailSender";
import { updatingAllDays } from "./controller/monday.controller";
const cron = require("node-cron");
const moment = require('moment-timezone');

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());


app.use(routes);
 const port = process.env.PORT
app.listen(port, () => console.log("Listening on port"));

connectToDB()

setTimeout(emailSender,3000)

// executing the function every evening:

cron.schedule('0 17 * * *', function() {
    emailSender()
}, {
  timezone: 'Israel'
});

// executing the function every midnight:

cron.schedule('0 0 * * *', function() {
    updatingAllDays()
}, {
  timezone: 'Israel'
});