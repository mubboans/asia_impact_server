const { Notification } = require("../Models/Notification");

const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");

const getNotification = TryCatch(async (req, res, next) => {
    let GetAllReport = await fnGet(Notification, req.query || {}, [], true);
    return returnResponse(res, 200, 'Successfully Get Notification', GetAllReport)
}
)

const updateNotification = TryCatch(async (req, res, next) => {
    await fnUpdate(Notification, req.body, { id: req.body.id }, req)
    return returnResponse(res, 200, 'Successfully Update Notification')

}
)

const deleteNotification = TryCatch(async (req, res, next) => {
    if (!req.query) {
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