
const express = require("express");

const { Register, Login, ForgotPassword, SendOTP, VerifyOTP, CheckUserAvailable } = require("../controllers/non_auth_controllers");
const route = express.Router();

route.post('/auth/login', Login);
route.post('/auth/register', Register);
route.post('/auth/forgot-password', ForgotPassword);
route.post('/auth/otp', SendOTP);
route.get('/auth/verifyotp', VerifyOTP);
route.post('/auth/otp', SendOTP);
route.post('/auth/checkusers', CheckUserAvailable);


module.exports = route;