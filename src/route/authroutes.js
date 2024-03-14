const express = require("express");
const { postNews, updateNews, deleteNews } = require("../controllers/news_controller");
const { getUserWithRelation, postRelation, updateRelation, deleteRelation } = require("../controllers/userRelation_controller");
const { postLanguage, updateLanguage, deleteLanguage } = require("../controllers/language_controller");
const { deleteUser, updateUser, getUser, postUser } = require("../controllers/user_controller");
const { getSustainGoal, updateSustainGoal, deleteSustainGoal, postSustainGoal } = require("../controllers/sustain_goal_controller");
const {
    getDocument,
    updateDocument,
    postDocument,
    deleteDocument
} = require("../controllers/document_controller");
const {
    getCompany,
    updateCompany,
    deleteCompany,
    postCompany
} = require("../controllers/company_controller");
const {
    postReport,
    deleteReport,
    updateReport,
    getReport
} = require("../controllers/report_controller");
const {
    getOpportunity,
    updateOpportunity,
    deleteOpportunity,
    postOpportunity
} = require("../controllers/opportunities_controller");
const {
    postNotification,
    deleteNotification,
    updateNotification,
    getNotification
} = require("../controllers/notification_controller");
const {
    getHighlight,
    updateHighlight,
    deleteHighlight,
    postHighlight
} = require("../controllers/highlight_controller");
const {
    updateInsight,
    deleteInsight,
    postInsight
} = require("../controllers/insight_controller");
const verifyRole = require("../middleware/verifyRole");

const route = express.Router();

route
    .route("/relation")
    .get(getUserWithRelation)
    .post(postRelation)
    .put(updateRelation)
    .delete(deleteRelation);

route
    .route("/language")
    .post(verifyRole("admin"), postLanguage)
    .put(verifyRole("admin"), updateLanguage)
    .delete(verifyRole("admin"), deleteLanguage);

route.route("/user").put(updateUser).get(getUser);

route
    .route("/sustaingoal")
    .get(getSustainGoal)
    .put(verifyRole("admin"), updateSustainGoal)
    .delete(verifyRole("admin"), deleteSustainGoal)
    .post(verifyRole("admin"), postSustainGoal);

route
    .route("/company")
    .get(getCompany)
    .put(verifyRole("admin"), updateCompany)
    .delete(verifyRole("admin"), deleteCompany)
    .post(verifyRole("admin"), postCompany);

route
    .route("/report")
    .get(getReport)
    .put(verifyRole("admin"), updateReport)
    .delete(verifyRole("admin"), deleteReport)
    .post(verifyRole("admin"), postReport);

route
    .route("/opportunity")
    .get(getOpportunity)
    .put(verifyRole("admin"), updateOpportunity)
    .delete(verifyRole("admin"), deleteOpportunity)
    .post(verifyRole("admin"), postOpportunity);

route
    .route("/notification")
    .get(getNotification)
    .put(verifyRole("admin"), updateNotification)
    .delete(verifyRole("admin"), deleteNotification)
    .post(verifyRole("admin"), postNotification);

route
    .route("/highlight")
    .get(getHighlight)
    .put(verifyRole("admin"), updateHighlight)
    .delete(verifyRole("admin"), deleteHighlight)
    .post(verifyRole("admin"), postHighlight);

route
    .route("/insight")
    .put(verifyRole("admin"), updateInsight)
    .delete(verifyRole("admin"), deleteInsight)
    .post(verifyRole("admin"), postInsight);

route.post("/user/add", verifyRole("admin"), postUser);
route.delete("/user/del", verifyRole("admin"), deleteUser);

route
    .route("/news")
    .post(verifyRole("admin"), postNews)
    .put(verifyRole("admin"), updateNews)
    .delete(verifyRole("admin"), deleteNews);

route
    .route("/document")
    .get(verifyRole("admin", "investor", "advisor", "explorer"), getDocument)
    .put(verifyRole("admin", "investor", "advisor", "explorer"), updateDocument)
    .post(verifyRole("admin", "investor", "advisor", "explorer"), postDocument)
    .delete(
        verifyRole("admin", "investor", "advisor", "explorer"),
        deleteDocument
    );

module.exports = route;
