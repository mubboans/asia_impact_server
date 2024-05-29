const { Op } = require("sequelize");
const { ActiveChatRequest } = require("../Models/ActiveChatRequest");
const { ActiveChatRequestHistory } = require("../Models/ActiveChatRequestHistory");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery, CheckUserRole } = require("../utils/functionalHelper");
const { Setting } = require("../Models/Setting");
const { Company } = require("../Models/Company");
const { Portfolio } = require("../Models/Portfolio");
const { User } = require("../Models/Users");
const { UserDetail } = require("../Models/UserDetail");

const getActiveChatRequest = TryCatch(async (req, res, next) => {
    const include = [];
    let rolecheck = CheckUserRole(req);
    let query = req.query;
    if (!rolecheck) {
        if (req.user.role == 'advisor') {
            if (!query.investorid) return next(customErrorClass.BadRequest("Invalid Advisor Request Please Pass Investor Id"))
            query = {
                ...query,
                [Op.or]: [
                    { sender_id: query.investorid ? query.investorid : req.user.userId },
                    { receiver_id: query.investorid ? query.investorid : req.user.userId },
                ],

            }
            let { data: settingCheck } = await fnGet(Setting,
                {
                    advisorId: req.user.userId,
                    investorid: query?.investorid,
                    viewChat: true
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
    else {
        include.push(
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
        )
    }
    // if (req?.query?.id) {
    include.push({
        model: ActiveChatRequestHistory,
        sourceKey: "activechatrequestid",
        foreignKey: "id",
        as: "activerequestchathistory",
        order: ["id", "DESC"]
    }, {
        model: Company,
        sourceKey: "companyid",
        attributes: ['id', 'name', 'companylogo', 'country'],
        include: [
            {
                model: Portfolio,
                sourceKey: "companyid",
                // ...(!rolecheck && )
                // where: { userid: query.investorid ? query.investorid : req.user.userId }
            }
        ]
    },
        // {
        //     model: User,
        //     sourceKey: "sender_id",
        //     attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
        //     include: {
        //         model: UserDetail,
        //         as: 'userdetail',
        //         attributes: ['id', 'firstname', 'lastname', 'img'],
        //     },
        //     as: 'SenderDetail'
        // },
        // {
        //     model: User,
        //     sourceKey: "receiver_id",
        //     attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
        //     include: {
        //         model: UserDetail,
        //         as: 'userdetail',
        //         attributes: ['id', 'firstname', 'lastname', 'img'],
        //     },
        //     as: 'ReceiverDetail'
        // }
    )

    // }

    let { data: GetAllActiveChatRequest, config } = await fnGet(ActiveChatRequest, query, include, false);
    if (!rolecheck) {
        let ActiveChatRequestArr = [];
        GetAllActiveChatRequest = GetAllActiveChatRequest.map(obj => {
            if (obj.Company?.Portfolios?.length > 0 && !rolecheck) {
                const currentUserId = query.investorid ? query.investorid : req.user.userId;
                const portfolioArr = obj.Company.Portfolios.filter(item => {
                    console.log(item.userid, currentUserId);
                    return item.userid === currentUserId;
                });

                ActiveChatRequestArr.push({
                    ...obj.dataValues, Company: {
                        ...obj.Company.dataValues,
                        Portfolios: portfolioArr.map(x => { return { ...x.dataValues } })
                    }
                })
            }
            else {
                ActiveChatRequestArr.push(obj)
            }
        })
        GetAllActiveChatRequest = ActiveChatRequestArr;
    }
    // GetAllActiveChatRequest = GetAllActiveChatRequest.filter(async (element, index) => {
    //     let { data: holdings } = fnGet(Portfolio, { userid: req.user.userId, companyid: element.companyid, attribute: ['count'] }, [], true)
    //     // return {
    //     //     ...element,
    //     //     holdings: holdings[0]?.count
    //     // }
    //     element.dataValues.holdings = holdings[0]?.count
    //     console.log(holdings[0]?.count, 'holdings[0]?.count');
    //     console.log(element.dataValues, 'element.dataValues');
    //     return element
    // });
    return returnResponse(res, 200, 'Successfully Get ActiveChatRequest', GetAllActiveChatRequest, config);
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
    let { data: deviceCheck } = await fnGet(ActiveChatRequest, { userid: body.userid, deviceId: body.deviceId }, [], false);
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