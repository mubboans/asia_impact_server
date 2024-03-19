const { Document } = require("../Models/Document");
const { FileStore } = require("../Models/FIleStore");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const FileUpload = require("../utils/uploadFile");

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

const documentUpload = TryCatch(async (req, res, next) => {
    console.log(req?.files?.file?.size / (1024 * 1024), 'in controller');
    if (!req.files) {
        throw new CustomErrorObj('File Required', 400);
    }
    if (req?.files?.file.length > 1) {
        throw new CustomErrorObj('Multiple file not allowed', 400);
    }
    if (req?.files?.file?.size / (1024 * 1024) >= 5) {
        throw new CustomErrorObj('File should be within 5mb', 400);
    }
    let obj = await FileUpload(req?.files?.file);
    await fnPost(FileStore, { ...obj, userid: req?.user?.userId }, [], req)
    return returnResponse(res, 200, 'Successfully Uploaded File', obj);
})

module.exports = {
    getDocument,
    updateDocument,
    deleteDocument,
    postDocument,
    documentUpload
}