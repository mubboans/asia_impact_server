const { Document } = require("../Models/Document");
const { LrDetail } = require("../Models/LRDetail");

const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const getLrDetail = TryCatch(async (req, res, next) => {
    let include = [];
    if (req.query.id) {
        include.push({
            model: Document, as: "document"
        }
        )
    }
    let data = await fnGet(LrDetail, req.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Data ', data)
}
)

const updateLrDetail = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(LrDetail, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const deleteLrDetail = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(LrDetail, req.query, req, "LrDetail_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete LrDetail')
}
)

const postLrDetail = TryCatch(async (req, res, next) => {
    let body = req.body;
    let include;
    if (body.document) {
        include =
        {
            include: [
                'document'
            ],
        }

    }
    else {
        include = [];
    }
    let lrdetail = await fnPost(LrDetail, req.body, include, req);
    if (body.documents && body.documents.length > 0) {
        let documentArr = body.documents.map((x) => {
            return {
                ...x,
                lrdetailid: lrdetail.id
            }
        });
        await fnbulkCreate(Document, documentArr, [], req);
    }
    return returnResponse(res, 201, 'Successfully Added LrDetail');
}
)


module.exports = {
    getLrDetail,
    updateLrDetail,
    deleteLrDetail,
    postLrDetail
}