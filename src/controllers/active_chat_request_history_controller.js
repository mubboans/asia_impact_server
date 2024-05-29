const { ActiveChatRequest } = require("../Models/ActiveChatRequest");
const { ActiveChatRequestHistory } = require("../Models/ActiveChatRequestHistory");
const { Setting } = require("../Models/Setting");
const { UserDetail } = require("../Models/UserDetail");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getActiveChatRequestHistory = TryCatch(async (req, res, next) => {
    // let query = setUserIdonQuery(req)

    let { data, config } = await fnGet(ActiveChatRequestHistory, req?.query || {}, [
        {
            model: ActiveChatRequest,
            foreignKey: 'activechatrequestid', // This should be the foreign key in ActiveChatRequestHistory
            as: 'activerequestchat',
        }
    ], false);
    // return returnResponse(res, 200, 'Successfully Get ActiveChatRequestHistory', GetAllActiveChatRequestHistory);

    // let { data, config } = await fnGet(News, options, [], true);
    return returnResponse(res, 200, 'Successfully Get News', data, config)
}
)

const updateActiveChatRequestHistory = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(ActiveChatRequestHistory, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    if (body.activechatrequest && body.activechatrequest) {
        await fnUpdate(ActiveChatRequest, body.activechatrequest, { id: body.activechatrequestid }, req);
        if (body.activechatrequest.notification) {
            await fnPost(ActiveChatRequestHistory, body.activechatrequest.notification, [], req);
        }
    }
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

    // let deviceCheck = await fnGet(ActiveChatRequestHistory, { userid: body.userid, deviceId: body.deviceId }, [], false);
    // let responseMessage = 'Added';
    // if (deviceCheck && deviceCheck.length > 0) {
    //     await fnUpdate(ActiveChatRequestHistory, body, { userid: body.userid, deviceId: body.deviceId }, req);
    //     responseMessage = 'Updated';
    // }
    // else {
    //     responseMessage = 'Added';
    if (body?.investorid) {
        let { data: settingCheck } = await fnGet(Setting,
            {
                advisorId: req.user.userId,
                investorid: body?.investorid,
                participateinChat: true
            }, [], true);
        if (!(settingCheck && settingCheck.length > 0)) return next(customErrorClass.BadRequest('Setting not found'))
        req.body = { ...req.body, sender_id: body.investorid };
    }
    await fnPost(ActiveChatRequestHistory, req.body, [
        {
            model: User,
            sourceKey: "sender_id",
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            },
            as: 'SenderDetail'
        },
        {
            model: User,
            sourceKey: "receiver_id",
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            },
            as: 'ReceiverDetail'
        }
    ], req);

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