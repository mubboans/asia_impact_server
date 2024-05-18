const express = require("express");
const { postNews, updateNews, deleteNews } = require("../controllers/news_controller");
const { getUserWithRelation, postRelation, updateRelation, deleteRelation, checkUserwithEmail } = require("../controllers/userRelation_controller");
const { postLanguage, updateLanguage, deleteLanguage } = require("../controllers/language_controller");
const { deleteUser, updateUser, getUser, postUser, ChangePassword, verifyUser, deleteUserAdmin, getDeletedUser, freezeUser, } = require("../controllers/user_controller");
const { getSustainGoal, updateSustainGoal, deleteSustainGoal, postSustainGoal } = require("../controllers/sustain_goal_controller");
const {
    getDocument,
    updateDocument,
    postDocument,
    deleteDocument,
    documentUpload
} = require("../controllers/document_controller");
const {
    getCompany,
    updateCompany,
    deleteCompany,
    postCompany,
    deleteDetailEntries
} = require("../controllers/company_controller");
const {
    postReport,
    deleteReport,
    updateReport,
    // getReport
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
    // getHighlight,
    updateHighlight,
    deleteHighlight,
    postHighlight,
    postHighlightInterestnFovourite,
    deleteHighlightInterestnFovourite,
    getHighlightInterestnFovourite
} = require("../controllers/highlight_controller");
const {
    updateInsight,
    deleteInsight,
    postInsight
} = require("../controllers/insight_controller");
const verifyRole = require("../middleware/verifyRole");
const { postLrDetail, updateLrDetail, getLrDetail, deleteLrDetail } = require("../controllers/lr_controller");
const { getUserDetail, updateUserDetail, deleteUserDetail, postUserDetail, verifyDetail, postuserdetaildocument, updateuserdetaildocument } = require("../controllers/userdetail_controller");
const { postSetting, updateSetting, getSetting, deleteSetting } = require("../controllers/setting_controller");
const { postDeviceDetail, updateDeviceDetail, getDeviceDetail, deleteDeviceDetail } = require("../controllers/device_controller");
const { postPortfolio, updatePortfolio, getPortfolio, deletePortfolio } = require("../controllers/user_portfolio");
const { postActiveRequest, updateActiveRequest, getActiveRequest, deleteActiveRequest } = require("../controllers/active_request_controller");
const { postActiveChatRequest, updateActiveChatRequest, getActiveChatRequest, deleteActiveChatRequest } = require("../controllers/active_chat_request_controller");
const { postActiveChatRequestHistory, updateActiveChatRequestHistory, getActiveChatRequestHistory, deleteActiveChatRequestHistory } = require("../controllers/active_chat_request_history_controller");
const { postComplaint, updateComplaint, getComplaint, deleteComplaint } = require("../controllers/complaint_controller");
const { postTransaction, updateTransaction, getTransaction, deleteTransaction } = require("../controllers/transaction_controller");
const { set_update_Pin, checkPin } = require("../controllers/pin_controller");

const route = express.Router();

route
    .route("/relation")
    .get(getUserWithRelation)
    .post(postRelation)
    .put(updateRelation)
    .delete(deleteRelation);

route
    .route("/language")
    .post(verifyRole("admin", "editor", "ai_officer"), postLanguage)
    .put(verifyRole("admin", "editor", "ai_officer"), updateLanguage)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteLanguage);

route.route("/user").put(updateUser).get(getUser);

route
    .route("/sustaingoal")
    .get(getSustainGoal)
    .put(verifyRole("admin", "editor", "ai_officer"), updateSustainGoal)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteSustainGoal)
    .post(verifyRole("admin", "editor", "ai_officer"), postSustainGoal);

route
    .route("/company")
    .get(getCompany)
    .put(verifyRole("admin", "editor", "ai_officer"), updateCompany)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteCompany)
    .post(verifyRole("admin", "editor", "ai_officer"), postCompany);

route
    .route("/report")
    // .get(getReport)
    .put(verifyRole("admin", "editor", "ai_officer"), updateReport)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteReport)
    .post(verifyRole("admin", "editor", "ai_officer"), postReport);

route
    .route("/opportunity")
    .get(getOpportunity)
    .put(verifyRole("admin"), updateOpportunity)
    .delete(verifyRole("admin"), deleteOpportunity)
    .post(verifyRole("admin"), postOpportunity);

route
    .route("/notification")
    .get(getNotification)
    .put(verifyRole("admin", "editor", "ai_officer", "individual_investor", "advisor", "legalrepresent"), updateNotification)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteNotification)
    .post(verifyRole("admin", "editor", "ai_officer"), postNotification);

route
    .route("/highlight")
    // .get(getHighlight)
    .put(verifyRole("admin", "editor", "ai_officer"), updateHighlight)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteHighlight)
    .post(verifyRole("admin", "editor", "ai_officer"), postHighlight);
// .post("/interestnfovourite", postHighlightInterestnFovourite)
// .delete("/interestnfovourite", deleteHighlightInterestnFovourite)
// .get("/interestnfovourite", getHighlightInterestnFovourite)

route
    .route("/insight")
    .put(verifyRole("admin", "editor", "ai_officer"), updateInsight)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteInsight)
    .post(verifyRole("admin", "editor", "ai_officer"), postInsight);

route.post("/user/add", verifyRole("admin", "editor"), postUser);
route.delete("/user/del", deleteUser);

route
    .route("/news")
    .post(verifyRole("admin", "editor", "ai_officer"), postNews)
    .put(verifyRole("admin", "editor", "ai_officer"), updateNews)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteNews);

route
    .route("/document")
    .get(verifyRole("admin", "editor", "ai_officer", "individual_investor", "advisor", "legalrepresent"), getDocument)
    .put(verifyRole("admin", "editor", "ai_officer", "individual_investor", "advisor", "legalrepresent"), updateDocument)
    .post(verifyRole("admin", "editor", "ai_officer", "individual_investor", "advisor", "legalrepresent"), postDocument)
    .delete(verifyRole("admin", "editor", "ai_officer", "individual_investor", "advisor", "basic"), deleteDocument);

route
    .route("/lrdetail")
    .post(postLrDetail)
    .put(updateLrDetail)
    .get(getLrDetail)
    .delete(verifyRole("admin", "legalrepresent"), deleteLrDetail);

route.post("/documentUpload", documentUpload)


route
    .route("/userdetail")
    .post(postUserDetail)
    .put(updateUserDetail)
    .get(getUserDetail)
    .delete(deleteUserDetail);

route.patch('/verifyDetail', verifyDetail);

route.delete('/sectionentries', verifyRole("admin", "legalrepresent", "editor", "ai_officer"), deleteDetailEntries);

route.route('/userdetaildocument').post(postuserdetaildocument).put(updateuserdetaildocument);

route.patch('/updatepassword', ChangePassword);

route.route("/interestnfovourite")
    .post(postHighlightInterestnFovourite)
    .delete(deleteHighlightInterestnFovourite)
    .get(getHighlightInterestnFovourite);

route.patch('/verifyuser', verifyRole("admin", "legalrepresent", "editor", "ai_officer"), verifyUser);

route.route('/setting').post(postSetting).put(updateSetting).get(getSetting).delete(deleteSetting);

route.route('/devicedetail').post(postDeviceDetail).put(updateDeviceDetail).get(getDeviceDetail).delete(deleteDeviceDetail);

route.route('/portfolio')
    .post(verifyRole("admin", "editor", "ai_officer"), postPortfolio)
    .put(verifyRole("admin", "editor", "ai_officer"), updatePortfolio)
    .get(getPortfolio)
    .delete(verifyRole("admin", "editor", "ai_officer"), deletePortfolio);

route.get('/deleteduser', verifyRole("admin", "editor", "ai_officer"), getDeletedUser);
route.delete('/deleteuser', verifyRole("admin", "editor", "ai_officer"), deleteUserAdmin);

route.route('/activerequest').post(postActiveRequest).put(updateActiveRequest).get(getActiveRequest).delete(deleteActiveRequest);

route.route('/activechatrequest').post(postActiveChatRequest).put(updateActiveChatRequest).get(getActiveChatRequest).delete(deleteActiveChatRequest);

route.route('/activechatrequesthistory').post(postActiveChatRequestHistory).put(updateActiveChatRequestHistory).get(getActiveChatRequestHistory).delete(deleteActiveChatRequestHistory);

route.patch('/user/freeze', verifyRole("admin", "editor", "ai_officer"), freezeUser);

route.route('/complaint')
    .post(postComplaint)
    .put(verifyRole("admin", "editor", "ai_officer"), updateComplaint)
    .get(verifyRole("admin", "editor", "ai_officer"), getComplaint)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteComplaint);

route.route('/transaction')
    .post(verifyRole("admin", "editor", "ai_officer"), postTransaction)
    .put(verifyRole("admin", "editor", "ai_officer"), updateTransaction)
    .get(verifyRole("admin", "editor", "ai_officer"), getTransaction)
    .delete(verifyRole("admin", "editor", "ai_officer"), deleteTransaction);

route.route('/pin').post(checkPin).patch(set_update_Pin);

route.post('/verifyuseremail', checkUserwithEmail)

module.exports = route;
