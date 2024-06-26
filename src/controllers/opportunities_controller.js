const { Opportunity } = require("../Models/Opportunities");
// const { CompanyNSustain } = require("../Models/CompanyNSustain");
// const { SustainGoal } = require("../Models/SustainGoal");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { Company } = require("../Models/Company");
const { Op } = require('sequelize');
const getOpportunity = TryCatch(async (req, res, next) => {
    let include = [
        {
            model: Company,
            sourceKey: "companyid",
            foreignKey: "id",
        }
    ];
    // if (req.query.id) {
    //     include = [{
    //         model: Company,
    //         sourceKey: "companyid",
    //         foreignKey: "id",
    //     }]
    // }
    // if (!req?.query?.user) {
    //     req.query.targetUser = 'explorer'
    // }
    // else {
    //     req.query.targetUser = {
    //         [Op.or]: {
    //             [Op.eq]: req?.query?.user,
    //             [Op.like]: `%${req?.query?.user}%`
    //         }
    //     }
    //     delete req?.query?.user
    // }
    let GetAllOpportunity = await fnGet(Opportunity, req.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Opportunity', GetAllOpportunity)
}
)

const updateOpportunity = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Opportunity, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    // await fnbulkCreate(CompanyNSustain, req.body.sustainarr, ['companyid', 'sustaingoalid', 'lastUsedIp', 'updatedBy'], req) // to bulk update the field to be update on db
    return returnResponse(res, 200, 'Successfully Update Opportunity')

}
)

const deleteOpportunity = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Opportunity, req.query, req, "Opportunity_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Opportunity')
}
)

const postOpportunity = TryCatch(async (req, res, next) => {

    let opportunitycode = await createRandomCode(Opportunity, 'opportunitycode');
    let body = req.body;
    if (body.isNew) {
        if (body.opportunitycode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            opportunitycode
        }
    }
    else {
        if (!body.opportunitycode) {
            return next(customErrorClass.BadRequest('Opportunity Code Require'))
        }
    }

    await fnPost(Opportunity, body, [], req);
    return returnResponse(res, 201, 'Successfully Added Opportunity');
}
)

module.exports = {
    getOpportunity,
    updateOpportunity,
    deleteOpportunity,
    postOpportunity
}