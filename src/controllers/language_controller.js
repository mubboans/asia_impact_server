const { Language } = require("../Models/Language");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");

const getLanguage = TryCatch(async (req, res, next) => {
    console.log(req.user, 'user token data');
    let GetAllLanguage = await fnGet(Language, req.query || {}, [], true);
    return returnResponse(res, 200, 'Successfully Get Language', GetAllLanguage)
}
)

const updateLanguage = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Language, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Language')
}
)

const deleteLanguage = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Language, req.query, req, "Language_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Language')
}
)

const postLanguage = TryCatch(async (req, res, next) => {
    console.log('post news');
    await fnPost(Language, req.body, [], req);
    return returnResponse(res, 201, 'Successfully Added Language');
}
)

module.exports = {
    getLanguage,
    updateLanguage,
    deleteLanguage,
    postLanguage
}