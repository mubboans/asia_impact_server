const { Document } = require("../Models/Document");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");

const getDocument = TryCatch(async (req, res, next) => {
    console.log(req.user, 'user token data');
    // if (req.user.role !== 'admin') {
    //     req.query = {
    //         ...req.query,
    //         userid:req.user.userId
    //     }
    // }
    let GetAllDocument = await fnGet(Document, req.query || {});
    return returnResponse(res, 200, 'Successfully Get Document', GetAllDocument)
}
)

const updateDocument = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Document, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Document')
}
)

const deleteDocument = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Document, req.query, req, "Document_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Document')
}
)

const postDocument = TryCatch(async (req, res, next) => {
    await fnPost(Document, req.body, [], req);
    return returnResponse(res, 201, 'Successfully Added Document');
}
)

module.exports = {
    getDocument,
    updateDocument,
    deleteDocument,
    postDocument
}