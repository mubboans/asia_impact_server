const express = require("express");
const { getNews, postNews, updateNews, deleteNews } = require("../controllers/news_controller");
const { getUserWithRelation, postRelation, updateRelation, deleteRelation } = require("../controllers/userRelation_controller");
const { getLanguage, postLanguage, updateLanguage, deleteLanguage } = require("../controllers/language_controller");
const { deleteUser, updateUser, getUser, postUser } = require("../controllers/user_controller");
const { getSustainGoal, updateSustainGoal, deleteSustainGoal, postSustainGoal } = require("../controllers/sustain_goal_controller");
const { getDocument, updateDocument, postDocument, deleteDocument } = require("../controllers/document_controller");
const { getCompany, updateCompany, deleteCompany, postCompany } = require("../controllers/company_controller");
const { postReport, deleteReport, updateReport, getReport } = require("../controllers/report_controller");
const { getOpportunity, updateOpportunity, deleteOpportunity, postOpportunity } = require("../controllers/opportunities_controller");
const { postNotification, deleteNotification, updateNotification, getNotification } = require("../controllers/notification_controller");
const { getHighlight, updateHighlight, deleteHighlight, postHighlight } = require("../controllers/highlight_controller");
const { getInsight, updateInsight, deleteInsight, postInsight } = require("../controllers/insight_controller");

const route = express.Router();


route.route('/news').get(getNews).post(postNews).put(updateNews).delete(deleteNews);

route.route('/relation').get(getUserWithRelation).post(postRelation).put(updateRelation).delete(deleteRelation);

route.route('/language').post(postLanguage).put(updateLanguage).delete(deleteLanguage);

route.route('/user').put(updateUser).get(getUser);

route.route('/sustaingoal').get(getSustainGoal).put(updateSustainGoal).delete(deleteSustainGoal).post(postSustainGoal);

route.route('/company').get(getCompany).put(updateCompany).delete(deleteCompany).post(postCompany);

route.route('/report').get(getReport).put(updateReport).delete(deleteReport).post(postReport);

route.route('/opportunity').get(getOpportunity).put(updateOpportunity).delete(deleteOpportunity).post(postOpportunity);

route.route('/notification').get(getNotification).put(updateNotification).delete(deleteNotification).post(postNotification);

route.route('/highlight').get(getHighlight).put(updateHighlight).delete(deleteHighlight).post(postHighlight);

route.route('/insight').get(getInsight).put(updateInsight).delete(deleteInsight).post(postInsight);

route.post("/user/add", postUser);
route.delete("/user/del", deleteUser);


route.route('/document').get(getDocument).put(updateDocument).post(postDocument).delete(deleteDocument);

module.exports = route;