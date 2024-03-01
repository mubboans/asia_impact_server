require('dotenv').config();
const express = require('express')
const cors = require("cors");
const morgan = require('morgan');
require('./dbConfig/dbConfig');
const errorresponse = require('./error/apiErrorHandler')
const non_auth_route = require("./route/non-authroutes")
const auth_route = require('./route/authroutes');
const { dbConnect } = require('./dbConfig/dbConfig');
const checkToken = require('./middleware/verifyRequest');

const app = express()
const port = process.env.PORT || 8001;


const corsOptions = {
  // origin: 'http://127.0.0.1:5173', // to allow specific origin
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ['set-cookie'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
morgan.token('reqid', (req) => req.user ? req.user.id : 'N/A');
morgan.token("err", function (req, res) { return req.error; });
// Create a custom token for user IP address


const jsonFormat = (tokens, req, res) => {
  return JSON.stringify({
    "remote-address": tokens["remote-addr"](req, res),
    "response-time": parseFloat(tokens["response-time"](req, res)),
    method: tokens["method"](req, res),
    url: tokens["url"](req, res),
    "http-version": tokens["http-version"](req, res),
    "status-code": parseInt(tokens["status"](req, res)),
    "content-length": parseInt(tokens["res"](req, res, "content-length")),
    referrer: tokens["referrer"](req, res),
    "user-agent": tokens["user-agent"](req, res),
    reqid: tokens["reqid"](req, res),
    err: tokens["err"](req, res),
  });
};
// Use morgan with custom tokens
app.use(morgan(jsonFormat));

// app.use(morgan('combined',))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/asiaimpact/v1', non_auth_route);
app.use('/asiaimpact/v1', checkToken, auth_route);


app.get('/life-check', (req, res) => {
  res.status(200).send('working fine 👍');
})

app.use(errorresponse)

app.listen(port, async () => {
  await dbConnect();
  console.log(`Your app listening on port ${port}`)
})