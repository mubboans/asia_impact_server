const { News } = require("../Models/News");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");

const getNews = TryCatch(async (req, res, next) => {
    console.log(req.user, 'user token data');
    let GetAllNews = await fnGet(News, req.query || {});
    return returnResponse(res, 200, 'Successfully Get News', GetAllNews)
}
)

const updateNews = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(News, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update News')
}
)

const deleteNews = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(News, req.query, req, "News_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete News')
}
)

const postNews = TryCatch(async (req, res, next) => {
    console.log('post news');
    await fnPost(News, req.body, [], req);
    return returnResponse(res, 201, 'Successfully Added News');
}
)

module.exports = {
    getNews,
    updateNews,
    deleteNews,
    postNews
}