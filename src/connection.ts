import { connect } from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const uri = process.env.TOKEN_SECRET;

const dbName = "eftadb";
const user = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST

export const connectToDB = async () => {
  try {
    await connect(`mongodb+srv://${user}:${mongoPassword}@${mongoHost}${dbName}`);
    console.log("db connected");
  } catch (err) {
    console.log("error connecting to DB", err);
  }
};