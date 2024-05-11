const { Op } = require("sequelize");
const { ActiveChatRequestHistory } = require("../Models/ActiveChatRequestHistory");
const { Notification } = require("../Models/Notification");
const { UserDetail } = require("../Models/UserDetail");
const { UserRelation } = require("../Models/UserRelation");
const { User } = require("../Models/Users");

const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { ActiveChatRequest } = require("../Models/ActiveChatRequest");

const getNotification = TryCatch(async (req, res, next) => {
    let query = req.query;
    let include =
        [
            {
                model: User,
                sourceKey: "sender_id",
                foreignKey: "id",
                // as: 'sender_detail',
                attributes: {
                    exclude: ['password']
                },
                include: ['userdetail']
            },

            {
                model: ActiveChatRequest,
                foreignKey: 'activechatrequestid', // This should be the foreign key in ActiveChatRequestHistory
                as: 'activerequestchat',
            }

        ]

    const promiseArr = [];

    let rolecheck = ['individual_investor', 'advisor', 'legalrepresent']
    if (rolecheck.includes(req.user.role)) // || req.user.role == 'basic'
    {
        query = {
            [Op.or]: [
                { sender_id: req.user.userId },
                { receiver_id: req.user.userId },

            ]
        }

    }

    if (query?.type == 'activechatrequesthistory') {
        promiseArr.push(fnGet(ActiveChatRequestHistory, query, include, false))
    }
    else if (query?.type == 'notification') {
        promiseArr.push(fnGet(Notification, query, [include[0]], false))
    }
    else {
        promiseArr.push(fnGet(Notification, query, [include[0]], false), fnGet(ActiveChatRequestHistory, query, include, false))
    }
    let data = await Promise.all(promiseArr);
    const structuredData = [
        {
            "notification": data[0],
            "activechatrequesthistory": data[1]
        }
    ]
    // let GetAllReport = await fnGet(Notification, req.query || {}, include, true);
    // let Activechatrequesthistory = await fnGet(ActiveChatRequestHistory)
    // let mergedData = [...data[0], ...data[1]];
    return returnResponse(res, 200, 'Successfully Get Notification', structuredData);
}
)

const updateNotification = TryCatch(async (req, res, next) => {
    if (req.body?.userrelation) {
        await fnUpdate(UserRelation, { requestStatus: req.body?.userrelation?.requestStatus }, { notification_id: req.body.id }, req);
    }
    await fnUpdate(Notification, req.body, { id: req.body.id }, req)
    return returnResponse(res, 200, 'Successfully Update Notification')
}
)

const deleteNotification = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Notification, req.query, req, "Notification_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Notification')
}
)

const postNotification = TryCatch(async (req, res, next) => {
    let notificationcode = await createRandomCode(Notification, 'notificationcode');
    let body = req.body;
    if (body.isNew) {
        if (body.notificationcode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            notificationcode
        }
    }
    else {
        if (!body.notificationcode) {
            return next(customErrorClass.BadRequest('Notification Code Require'))
        }
    }
    await fnPost(Notification, body, [], req);
    return returnResponse(res, 201, 'Successfully Added Notification');
}
)

module.exports = {
    getNotification,
    updateNotification,
    deleteNotification,
    postNotification
}