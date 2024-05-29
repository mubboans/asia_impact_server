require('dotenv').config();
const express = require('express')
const cors = require("cors");
const morgan = require('morgan');
require('./dbConfig/dbConfig');
const fileUpload = require('express-fileupload');
const errorresponse = require('./error/apiErrorHandler')
const non_auth_route = require("./route/non-authroutes")
const auth_route = require('./route/authroutes');
const { dbConnect } = require('./dbConfig/dbConfig');
const { checkToken } = require('./middleware/verifyRequest');
const { route_not_found } = require('./helper/responseHelper');
const TryCatch = require('./utils/TryCatchHelper');
const createSocket = require('./controllers/socket_controller');
const path = require("path");
const app = express()
const port = process.env.PORT || 8001;

app.use(fileUpload(
  //   {
  //   limits: { fileSize: 3 * 1024 }, // file size
  // }
));

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

app.use(express.static(path.resolve("./public")));
app.get("/socket", (req, res) => {
  return res.sendFile(__dirname + "/public/index.html");
});
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
  res.status(200).send('working fine  api👍');
})



app.use(errorresponse)

app.use(route_not_found)

const { io, server } = createSocket(app);
server.listen(port, async () => {
  // console.log(`Server is running on port ${port}`);
  await dbConnect();
  console.log(`Your app listening on port ${port}`)
});
createSocket(app);
// app.listen(port, TryCatch(async () => {
//   await dbConnect();
//   console.log(`Your app listening on port ${port}`)
// }
// )
// )