const { ActiveChatRequest } = require("../Models/ActiveChatRequest");
const { ActiveChatRequestHistory } = require("../Models/ActiveChatRequestHistory");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getActiveChatRequestHistory = TryCatch(async (req, res, next) => {
    // let query = setUserIdonQuery(req)

    let GetAllActiveChatRequestHistory = await fnGet(ActiveChatRequestHistory, req?.query || {}, [
        {
            model: ActiveChatRequest,
            foreignKey: 'activechatrequestid', // This should be the foreign key in ActiveChatRequestHistory
            as: 'activerequestchat',
        }
    ], false);
    return returnResponse(res, 200, 'Successfully Get ActiveChatRequestHistory', GetAllActiveChatRequestHistory);
}
)

const updateActiveChatRequestHistory = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(ActiveChatRequestHistory, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update ActiveChatRequestHistory')
}
)

const deleteActiveChatRequestHistory = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(ActiveChatRequestHistory, req.query, req, "ActiveChatRequestHistory" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete ActiveChatRequestHistory')
}
)

const postActiveChatRequestHistory = TryCatch(async (req, res, next) => {
    let body = req.body;
    if (body.activechatrequest && body.activechatrequestid) {
        await fnUpdate(ActiveChatRequest, body.activechatrequest, { id: body.activechatrequestid }, req);
    }
    // let deviceCheck = await fnGet(ActiveChatRequestHistory, { userid: body.userid, deviceId: body.deviceId }, [], false);
    // let responseMessage = 'Added';
    // if (deviceCheck && deviceCheck.length > 0) {
    //     await fnUpdate(ActiveChatRequestHistory, body, { userid: body.userid, deviceId: body.deviceId }, req);
    //     responseMessage = 'Updated';
    // }
    // else {
    //     responseMessage = 'Added';
    await fnPost(ActiveChatRequestHistory, req.body, [], req);

    // }
    return returnResponse(res, 201, `Successfully Added ActiveChatRequestHistory`);
}
)


module.exports = {
    getActiveChatRequestHistory,
    updateActiveChatRequestHistory,
    deleteActiveChatRequestHistory,
    postActiveChatRequestHistory
}