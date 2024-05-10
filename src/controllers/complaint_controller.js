const { Complaint } = require("../Models/Complaint");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");

const getComplaint = TryCatch(async (req, res, next) => {
    let GetAllComplaint = await fnGet(Complaint, req.query || {}, [], false);
    return returnResponse(res, 200, 'Successfully Get Complaint', GetAllComplaint);
}
)

const updateComplaint = TryCatch(async (req, res, next) => {
    await fnUpdate(Complaint, req.body, { id: req.body.id }, req)
    return returnResponse(res, 200, 'Successfully Update Complaint')
}
)

const deleteComplaint = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Complaint, req.query, req, "Complaint" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Complaint')
}
)

const postComplaint = TryCatch(async (req, res, next) => {
    let body = req.body;
    body.userid = req.user.userId;
    await fnPost(Complaint, body, [], req);
    return returnResponse(res, 201, `Successfully Added Complaint`);
}
)


module.exports = {
    getComplaint,
    updateComplaint,
    deleteComplaint,
    postComplaint
}