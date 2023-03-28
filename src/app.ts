import express from "express";
import routes from "./routes/index";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDB } from "./connection";

const app = express();
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   });

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());


app.use(routes);
 const port = process.env.PORT
app.listen(port, () => console.log("Listening on port"));

connectToDB()

