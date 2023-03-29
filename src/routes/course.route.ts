import express, {  Request, Response } from "express";
import { addCourseData } from "../controller/course.controller";
import { authCheck } from "../middleware/authCheck";
// var cookieParser = require("cookie-parser");
var querystring = require("querystring");
var request = require("request");
// import request from 'request'
var dotenv = require("dotenv");

dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/admin";

const courseRouter = express.Router();


courseRouter.post("/addingMonday",authCheck('admin'), addCourseData);



courseRouter.get("/", function (req, res) {
  res.sendFile("/index.html");
});

courseRouter.get("/finish", function (req, res) {
  res.sendFile("/finish.html", { root: __dirname + "/public" });
});

courseRouter.get("/start", function (req, res) {
  const state = "moveobootcamp";
  res.cookie("monday_auth_state", state);

  res.redirect(
    "https://auth.monday.com/oauth2/authorize?" +
      querystring.stringify({
        client_id: client_id,
        redirect_uri: redirect_uri + "/oauth/callback",
        state: state,
        scopes: "me:read boards:read",
      })
  );
});

courseRouter.get("/oauth/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies["monday_auth_state"] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "finish" +
        querystring.stringify({
          error: "state_does_not_match",
        })
    );
  } else {
    res.clearCookie("monday_auth_state");
    const authRequest = {
      url: "https://auth.monday.com/oauth2/token",
      from: {
        redirect_uri: redirect_uri + "/oauth/callback",
        client_id: client_id,
        client_secret: client_secret,
        code: code,
      },
    };

    request.post(authRequest, function (error: any, response: any, body: any) {
      if (!error && response.statusCode === 200) {
        const jsonBody = JSON.parse(body);
        const accessToken = jsonBody.access_token || null;
        const refreshToken = jsonBody.refresh_token || null;
        const tokenType = jsonBody.token_type || null;
        const scope = jsonBody.scope || null;

        res.redirect(
          "/finish?" +
            querystring.stringify({
              status: "success",
              access_token: accessToken,
              refresh_token: refreshToken,
              token_type: tokenType,
              scope: scope,
            })
        );
      } else {
        res.redirect(
          "/finish?" +
            querystring.stringify({
              status: "failure",
            }));
      }
    });
  }
});

export default courseRouter;
