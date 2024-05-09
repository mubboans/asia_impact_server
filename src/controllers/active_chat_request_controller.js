const { Op } = require("sequelize");
const { ActiveChatRequest } = require("../Models/ActiveChatRequest");
const { ActiveChatRequestHistory } = require("../Models/ActiveChatRequestHistory");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery, CheckUserRole } = require("../utils/functionalHelper");
const { Setting } = require("../Models/Setting");

const getActiveChatRequest = TryCatch(async (req, res, next) => {
    const include = [];
    let rolecheck = CheckUserRole(req);
    let query = req.query;
    if (!rolecheck) {
        if (req.user.role == 'advisor') {
            if (!query.investorid) return next(customErrorClass.BadRequest("Invalid Advisor Request"))
            query = {
                ...query,
                [Op.or]: [
                    { sender_id: query.investorid ? query.investorid : req.user.userId },
                    { receiver_id: query.investorid ? query.investorid : req.user.userId },
                ],

            }
            let settingCheck = await fnGet(Setting,
                {
                    advisorId: req.user.userId,
                    userid: query?.investorid,
                    expressInterest: true
                }, [], true);
            if (!(settingCheck && settingCheck.length > 0)) {
                return next(customErrorClass.NotFound("Your Account permission not found"));
            }

        }
        else {
            query = {
                ...query,
                [Op.or]: [
                    { sender_id: req.user.userId },
                    { receiver_id: req.user.userId },
                ],

            }
        }
        delete query.investorid;
    }

    if (req?.query?.id) {
        include.push({
            model: ActiveChatRequestHistory,
            sourceKey: "activechatrequestid",
            foreignKey: "id",
            as: "activerequestchathistory",
            order: ["id", "DESC"]
        })

    }
    let GetAllActiveChatRequest = await fnGet(ActiveChatRequest, query, include, false);
    return returnResponse(res, 200, 'Successfully Get ActiveChatRequest', GetAllActiveChatRequest);
}
)

const updateActiveChatRequest = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(ActiveChatRequest, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update ActiveChatRequest')
}
)

const deleteActiveChatRequest = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(ActiveChatRequest, req.query, req, "ActiveChatRequest" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete ActiveChatRequest')
}
)

const postActiveChatRequest = TryCatch(async (req, res, next) => {
    let body = req.body;
    let deviceCheck = await fnGet(ActiveChatRequest, { userid: body.userid, deviceId: body.deviceId }, [], false);
    let responseMessage = 'Added';
    if (deviceCheck && deviceCheck.length > 0) {
        await fnUpdate(ActiveChatRequest, body, { userid: body.userid, deviceId: body.deviceId }, req);
        responseMessage = 'Updated';
    }
    else {
        responseMessage = 'Added';
        await fnPost(ActiveChatRequest, req.body, [], req);

    }
    return returnResponse(res, 201, `Successfully ${responseMessage} ActiveChatRequest`);
}
)


module.exports = {
    getActiveChatRequest,
    updateActiveChatRequest,
    deleteActiveChatRequest,
    postActiveChatRequest
}