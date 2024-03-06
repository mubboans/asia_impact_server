const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { Company } = require("../Models/Company");
const { Highlight } = require("../Models/HIghlight");
const { HighlightDetail } = require("../Models/HighlightDetail");

const getHighlight = TryCatch(async (req, res, next) => {
    let include = [];
    if (req.query.id) {
        include = [{
            model: HighlightDetail,
            sourceKey: "highlightid",
            foreignKey: "id",
            as: "highligthdetail"
        }]
    }
    let GetAllHighlight = await fnGet(Highlight, req.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Highlight', GetAllHighlight)
}
)

const updateHighlight = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Highlight, req.body, { id: req.body.id }, req)
    await fnbulkCreate(HighlightDetail, req.body.highligthdetail, ['title', 'ordernumber', 'type', 'lastUsedIp', 'updatedBy'], req);
    // to bulk update the field to be update on db
    return returnResponse(res, 200, 'Successfully Update Highlight')

}
)

const deleteHighlight = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Highlight, req.query, req, "Highlight_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Highlight')
}
)

const postHighlight = TryCatch(async (req, res, next) => {
    let highlightcode = await createRandomCode(Highlight);
    let body = req.body;
    if (body.isNew) {
        if (body.highlightcode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            highlightcode
        }
    }
    else {
        if (!body.highlightcode) {
            return next(customErrorClass.BadRequest('Highlight Code Require'))
        }
    }
    await fnPost(Highlight, body, {
        include: ['highligthdetail']
    }, req);
    return returnResponse(res, 201, 'Successfully Added Highlight');
}
)

module.exports = {
    getHighlight,
    updateHighlight,
    deleteHighlight,
    postHighlight
}