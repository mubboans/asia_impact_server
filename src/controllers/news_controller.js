const { Op } = require('sequelize');
const { News } = require("../Models/News");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { checkTokenForNews } = require('../middleware/verifyRequest');

// let newJoi = Joi.object({

// })
const getNews = TryCatch(async (req, res, next) => {
    let query = checkTokenForNews(req);
    console.log(query, 'user token data');
    delete query?.userid;
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
    let { data, config } = await fnGet(News, options, [], true);
    return returnResponse(res, 200, 'Successfully Get News', data, config)
}
)

const updateNews = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(News, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update News')
}
)

const deleteNews = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(News, req.query, req, "News_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete News')
}
)

const postNews = TryCatch(async (req, res, next) => {
    let newcode = await createRandomCode(News, 'newcode');
    console.log('post news');
    let body = req.body;
    if (body.isNew) {
        if (body.newcode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            newcode
        }
    }
    else {
        if (!body.newcode) {
            return next(customErrorClass.BadRequest('News Code Require'))
        }
    }
    await fnPost(News, body, [], req);
    return returnResponse(res, 201, 'Successfully Added News');
}
)
function createCode() {

}
module.exports = {
    getNews,
    updateNews,
    deleteNews,
    postNews
}