const { Notification } = require("../Models/Notification");
const { UserRelation } = require("../Models/UserRelation");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { Op } = require("sequelize");
const { createRandomCode, getCurrentFormatedDate } = require("../utils/functionalHelper");
const { UserDetail } = require("../Models/UserDetail");
const getUserWithRelation = TryCatch(async (req, res, next) => {
    console.log('hit user 8');
    let d = setUserId(req);
    console.log('hit user 10');
    let query = {
        ...req.query,
        ...d,
        deletionDate: null
    }
    let include = [
        {
            model: User, as: 'advisor',
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            }
        },
        {
            model: User, as: 'investor',
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            }
        },
        {
            model: Notification
        }
    ];

    console.log(query, 'hit user');
    let { data, config } = await fnGet(UserRelation, query, include, false);
    return returnResponse(res, 200, 'Successfully Get Data ', data, config)
}
)

const updateRelation = TryCatch(async (req, res, next) => {
    let body = req.body;
    let notify;
    if (body.notification) {
        notify = await fnPost(Notification, body.notification, [], req);
    }
    let updateStatus = await fnUpdate(UserRelation, { ...body, notification_id: notify.id }, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const deleteRelation = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    // let deleteStatus = await fnDelete(UserRelation, req.query, req, "UserRelation _" + req.query.id)
    let deleteStatus = await fnUpdate(UserRelation, { requestStatus: 'deleted', deletionDate: getCurrentFormatedDate(), deletedBy: req?.user?.userId }, req.query, "UserRelation _" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete UserRelation')
}
)

const getDeletedRelation = TryCatch(async (req, res, next) => {
    let deletedRelationData = await fnGet(UserRelation, { deletionDate: !null }, [], false);
    return returnResponse(res, 200, 'Successfully Delete UserRelation', deletedRelationData);
})

const postRelation = TryCatch(async (req, res, next) => {
    let body = setUserDetail(req.user, req.body);

    if (body.notification) {
        let { data: UserDetail } = await fnGet(User, { email: body.notification.email }, [], true);
        if (UserDetail && UserDetail.length > 0) {
            let notificationcode = await createRandomCode(Notification, 'notificationcode');
            let obj = {
                ...body.notification,
                sender_id: req.user.userId, // current user id
                receiver_id: UserDetail[0].id, // user to recieve the notification
                notificationcode,
                isNew: true
            }
            let notifi = await fnPost(Notification, obj, [], req);
            await fnPost(UserRelation, { ...body, notification_id: notifi?.id, req }, [], req);
        }
        else {
            return next(customErrorClass.BadRequest("No User Found with detail"));
        }
    }
    // await Promise.all(promiseArr);
    return returnResponse(res, 201, 'Successfully added userRelation and send notifications');
}
)

const checkUserwithEmail = TryCatch(async (req, res, next) => {
    let { email } = req.body;
    let { data: userCheck } = await fnGet(User, { email, deletionDate: null }, [], true);
    if (userCheck.length > 0 && userCheck) {
        return returnResponse(res, 200, "User detail found", {
            role: userCheck[0].role,
            access_group: userCheck[0].access_group,
            type: userCheck[0].type,
            isActive: userCheck[0].isActive,
        })
    }
    else {
        return returnResponse(res, 200, "User detail Not found", {})
    }
}
)
function setUserId(req) {
    let d;
    switch (req.user.role) {
        case 'advisor':
            d = {
                advisorId: req.user.userId,
                relationshipType: 0
            }
            break;
        case 'investor':
            d = {
                investorId: req.user.userId,
                relationshipType: 1
            }
            break;
        case 'legalrepresent':
            d = {
                investorId: req.user.userId,
                relationshipType: 1
            }
            break;
    }
    return d;
}
function setUserDetail(user, body) {
    if (user.role == 'advisor') {
        body = {
            ...body,
            advisorId: user.userId,
            relationshipType: 0,
            requesterId: user.userId,
        }
    }
    else if (user.role == 'investor' || user.role == 'legalrepresent') {
        body = {
            ...body,
            investorId: user.userId,
            relationshipType: 1,
            requesterId: user.userId,
        }
    }
    else {
        body = { ...body, requesterId: user.userId, };
    }
    return body;
}

module.exports = {
    getUserWithRelation,
    updateRelation,
    deleteRelation,
    postRelation,
    checkUserwithEmail
}