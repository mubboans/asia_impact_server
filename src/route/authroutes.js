const express = require("express");
const { getNews, postNews, updateNews, deleteNews } = require("../controllers/news_controller");
const { getUserWithRelation, postRelation, updateRelation, deleteRelation } = require("../controllers/userRelation_controller");
const { getLanguage, postLanguage, updateLanguage, deleteLanguage } = require("../controllers/language_controller");
const { deleteUser, updateUser, getUser, postUser } = require("../controllers/user_controller");
const { getSustainGoal, updateSustainGoal, deleteSustainGoal, postSustainGoal } = require("../controllers/sustain_goal_controller");

const route = express.Router();


route.route('/news').get(getNews).post(postNews).put(updateNews).delete(deleteNews);

route.route('/relation').get(getUserWithRelation).post(postRelation).put(updateRelation).delete(deleteRelation);

route.route('/language').post(postLanguage).put(updateLanguage).delete(deleteLanguage);

route.route('/user').put(updateUser).get(getUser);

route.route('/sustaingoal').get(getSustainGoal).put(updateSustainGoal).delete(deleteSustainGoal).post(postSustainGoal);

route.post("/user/add", postUser);
route.delete("/user/del", deleteUser)


module.exports = route;