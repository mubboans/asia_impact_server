const { Op } = require("sequelize");
const { ActiveChatRequest } = require("../Models/ActiveChatRequest");
const { ActiveChatRequestHistory } = require("../Models/ActiveChatRequestHistory");
const { ActiveRequest } = require("../Models/ActiveRequest");
const { Portfolio } = require("../Models/Portfolio");
const { Setting } = require("../Models/Setting");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { CheckUserRole } = require("../utils/functionalHelper");

const getActiveRequest = TryCatch(async (req, res, next) => {
    let query = req?.query;
    const include = [];
    let rolecheck = CheckUserRole(req);
    if (!rolecheck) {
        if (req.user.role == 'advisor') {
            if (!query.investorid) return next(customErrorClass.BadRequest("Invalid Advisor Request"))
            query = {
                ...query,
                useridInvestor: query.investorid,
                useridAdvisor: request.user.userId
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
                useridInvestor: req.user.userId
            }
        }
        // query = {
        //     ...query,
        //     [Op.or]: [
        //         { useridInvestor: query.investorid ? query.investorid : req.user.userId },
        //         { useridAdvisor: query.investorid ? req.user.userId : null },
        //     ],
        // }
    }
    if (query?.id) {
        // query = {
        //     ...query,
        //     useridAdvisor: {
        //         [Op.not]: null
        //     }
        // }
        include.push({
            model: User,
            sourcekey: "useridAdvisor",
            as: "AdvisorDetail",
            // where: {
            //     useridAdvisor: {
            //         [Op.not]: null
            //     }
            // }
        },
            {
                model: User,
                sourcekey: "useridInvestor",
                as: "InvestorDetail"
            },
        )
    }
    let GetAllActiveRequest = await fnGet(ActiveRequest, query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get ActiveRequest', GetAllActiveRequest);

}
)

const updateActiveRequest = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(ActiveRequest, req.body, { id: req.body.id }, req)
    // console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update ActiveRequest')
}
)

const deleteActiveRequest = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(ActiveRequest, req.query, req, "ActiveRequest" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete ActiveRequest')
}
)

const postActiveRequest = TryCatch(async (req, res, next) => {
    let body = req.body;
    if (body.userid !== req.user.userId) return next(customErrorClass.BadRequest("Userid not Match"));
    if (req.user.role == 'advisor') {
        let settingCheck = await fnGet(Setting, { advisorId: body.userid, userid: body.investorid, expressInterest: true }, [], true);
        if (!(settingCheck && settingCheck.length > 0)) {
            return next(customErrorClass.NotFound("Your Account permission not found"));
        }

    }
    else if (req.user.role == 'individual_investor' || req.user.role == 'legalrepresent') {
        if (body.investorid) return next(customErrorClass.BadRequest("Investor Not Allowed"))
    }

    const portfolio = await fnGet(Portfolio, { companyid: req.body.companyid }, [], false);
    let activeObj = await fnPost(ActiveRequest, {
        useridAdvisor: body.investorid ? body.userid : null,
        companyid: body.companyid,
        useridInvestor: body.investorid ? body.investorid : body.userid,
        interestmessage: body.interestmessage,
        requestinitiatedby: body.investorid ? "advisor" : "investor"
    }, [], req);
    let data = portfolio.map(
        // element => {
        // });
        (x) => {
            // let activeObj = await fnPost(ActiveRequest, {
            //     useridAdvisor: body.investorid ? body.userid : null,
            //     companyid: body.companyid,
            //     useridInvestor: body.investorid ? body.investorid : body.userid,
            //     interestmessage: body.interestmessage,
            //     requestinitiatedby: body.investorid ? "advisor" : "investor"
            // }, [], req);
            // await fnPost(ActiveChatRequest, {
            //     activerequestid: activeObj?.id,
            //     companyid: body.companyid,
            //     message: body.interestmessage,
            //     status: body.status,
            //     sender_id: body.investorid ? body.investorid : body.userid,
            //     receiver_id: x.userid,
            //     activerequestchathistory: {
            //         activerequestid: activeObj?.id,
            //         companyid: body.companyid,
            //         sender_id: body.investorid ? body.investorid : body.userid,
            //         receiver_id: x.userid,
            //         message: body.interestmessage,
            //     }
            // }, {
            //     include: [
            //         {
            //             model: ActiveChatRequestHistory,
            //             as: 'activerequestchathistory'
            //         }
            //     ]
            // }, req);
            return {
                // useridAdvisor: body.investorid ? body.userid : null,
                // companyid: body.companyid,
                // useridInvestor: body.investorid ? body.investorid : body.userid,
                // interestmessage: body.interestmessage,
                // requestinitiatedby: body.investorid ? "advisor" : "investor",
                // activechaterequest: {
                activerequestid: activeObj?.id,
                companyid: body.companyid,
                message: body.interestmessage,
                status: body.status,
                sender_id: body.investorid ? body.investorid : body.userid,
                receiver_id: x.userid,
                activerequestchathistory: {
                    activerequestid: activeObj?.id,
                    companyid: body.companyid,
                    sender_id: body.investorid ? body.investorid : body.userid,
                    receiver_id: x.userid,
                    message: body.interestmessage,
                }
                // }
            }
        })
    await fnbulkCreate(ActiveChatRequest, data, [], {
        include: [
            {
                model: ActiveChatRequestHistory,
                as: 'activerequestchathistory'
            }
        ]
    }, req);
    return returnResponse(res, 201, `Successfully Added ActiveRequest with ${portfolio.length} ActiveChatRequest and ActiveChatRequestHistory`);
}
)


module.exports = {
    getActiveRequest,
    updateActiveRequest,
    deleteActiveRequest,
    postActiveRequest
}