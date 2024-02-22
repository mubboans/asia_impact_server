const express = require("express");
const { getNews, postNews, updateNews, deleteNews } = require("../controllers/news_controller");
const { getUserWithRelation, postRelation, updateRelation, deleteRelation } = require("../controllers/user_controller");
const { getLanguage, postLanguage, updateLanguage, deleteLanguage } = require("../controllers/language_controller");

const route = express.Router();


route.route('/news').get(getNews).post(postNews).put(updateNews).delete(deleteNews);

route.route('/relation').get(getUserWithRelation).post(postRelation).put(updateRelation).delete(deleteRelation);

route.route('/language').get(getLanguage).post(postLanguage).put(updateLanguage).delete(deleteLanguage);

module.exports = route;