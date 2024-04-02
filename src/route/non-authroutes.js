
const express = require("express");

const { Register, Login, ForgotPassword, SendOTP, VerifyOTP, CheckUserAvailable, refereshToken, documentUpload, loginonOtp } = require("../controllers/non_auth_controllers");
const { getLanguage } = require("../controllers/language_controller");
const { getNews } = require("../controllers/news_controller");
const { getInsight } = require("../controllers/insight_controller");
const route = express.Router();

route.post('/auth/login', Login);
route.post('/auth/register', Register);
route.post('/auth/forgot-password', ForgotPassword);
route.post('/auth/otp', SendOTP);
route.get('/auth/verifyotp', VerifyOTP);
route.post('/auth/otp', SendOTP);
route.post('/auth/checkusers', CheckUserAvailable);
route.get('/auth/language', getLanguage);
route.post("/auth/refreshtoken", refereshToken);
route.get('/auth/news', getNews);

route.get('/auth/insight', getInsight);

module.exports = route;