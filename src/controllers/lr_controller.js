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
    let { data, config } = await fnGet(LrDetail, req.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Data ', data)
}
)

const updateLrDetail = TryCatch(async (req, res, next) => {
    let body = req?.body;
    let promiseArr = []
    if (Array.isArray(body) && body.length > 0) {
        for (let i = 0; i < body.length; i++) {
            const element = body[i];
            if (!element.id) {
                promiseArr.push(fnPost(LrDetail, element, { include: ['document'] }, req))
            }
            else {
                promiseArr.push(fnUpdate(LrDetail, element, { id: element.id }, req));
                if (element?.document && element.document.length > 0) {
                    for (let index = 0; index < element?.document.length; index++) {
                        const docelement = element.document[index];
                        if (!docelement.id) promiseArr.push(fnPost(Document, docelement, [], req))
                        // return next(customErrorClass.BadRequest("Invalid Document Object"));
                        else promiseArr.push(fnUpdate(Document, docelement, { id: docelement.id }, req));
                    }
                }
            }
        }
    }
    else {
        promiseArr.push(fnUpdate(LrDetail, body, { id: body.id }, req));
        if (Array.isArray(body?.document) && body?.document?.length > 0) {
            for (let index = 0; index < body?.document.length; index++) {
                const element = body?.document[index];
                if (!element.id) return next(customErrorClass.BadRequest("Document Id Required"))
                promiseArr.push(fnUpdate(Document, element, { id: element.id }, req));
            }
        }
        else if (body?.document?.id) {
            // if(body?.document.length = 0){

            //     // if (!body?.document.id) return next(customErrorClass.BadRequest("Document Id Required"))
            //     // promiseArr.push(fnUpdate(Document, body?.document, { id: body?.document.id }, req))
            // }
            // else{
            // if (!body?.document.id) return next(customErrorClass.BadRequest("Document Id Required"))
            promiseArr.push(fnUpdate(Document, body?.document, { id: body?.document.id }, req))
            // }
        }
    }
    await Promise.all(promiseArr);
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const deleteLrDetail = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(LrDetail, req.query, req, "LrDetail_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete LrDetail')
}
)

const postLrDetail = TryCatch(async (req, res, next) => {
    let body = req.body;
    const include =
    {
        include: [
            'document'
        ],
    }
    if (Array.isArray(body) && body.length > 0) {
        // for (var i = 0; i > body.length; i++) {
        //     let data = body[i];
        // let include;
        // if (body.document) {
        // }
        // else {
        //     include = [];
        // }
        await fnbulkCreate(LrDetail, body, [], include, req);
        // let lrdetail = await fnPost(LrDetail, req.body, include, req);
        // }
    }
    else {
        let lrdetail = await fnPost(LrDetail, req.body, include, req);
    }



    // if (body.documents && body.documents.length > 0) {
    //     let documentArr = body.documents.map((x) => {
    //         return {
    //             ...x,
    //             lrdetailid: lrdetail.id
    //         }
    //     });
    //     await fnbulkCreate(Document, documentArr, [], req);
    // }
    return returnResponse(res, 201, 'Successfully Added LrDetail');
}
)


module.exports = {
    getLrDetail,
    updateLrDetail,
    deleteLrDetail,
    postLrDetail
}