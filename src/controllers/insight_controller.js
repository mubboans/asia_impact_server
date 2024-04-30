const { Op } = require('sequelize');
const { Insight } = require("../Models/Insight");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { checkTokenForNews } = require("../middleware/verifyRequest");

// let newJoi = Joi.object({

// })
const getInsight = TryCatch(async (req, res, next) => {
    let query = checkTokenForNews(req);
    console.log(query, 'user token data');
    // if (checkToken) {
    //     console.log('get all admin data');
    // } else {
    //     if (!req?.user?.role) {
    //         req.query.targetUser = 'basic'
    //     }
    //     else {
    //         req.query.targetUser = {
    //             [Op.or]: {
    //                 [Op.eq]: req?.user?.role,
    //                 [Op.like]: `%${req?.user?.role}%`
    //             }
    //         }

    //     }
    //     delete req?.query?.user
    // }
    let options = {
        ...query,
        attribute: { exclude: ['description'] }
    }
    if (req.query.id) {
        delete options.attribute;
    }
    let GetAllInsight = await fnGet(Insight, options, [], true);
    return returnResponse(res, 200, 'Successfully Get Insight', GetAllInsight)
}
)

const updateInsight = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Insight, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Insight')
}
)

const deleteInsight = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(Insight, req.query, req, "Insight_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Insight')
}
)

const postInsight = TryCatch(async (req, res, next) => {
    let insightcode = await createRandomCode(Insight, 'insightcode');
    let body = req.body;
    if (body.isNew) {
        if (body.insightcode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            insightcode
        }
    }
    else {
        if (!body.insightcode) {
            return next(customErrorClass.BadRequest('Insight Code Require'))
        }
    }
    await fnPost(Insight, body, [], req);
    return returnResponse(res, 201, 'Successfully Added Insight');
}
)

module.exports = {
    getInsight,
    updateInsight,
    deleteInsight,
    postInsight
}