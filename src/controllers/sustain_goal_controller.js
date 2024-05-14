const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { SustainGoal } = require("../Models/SustainGoal");

// let newJoi = Joi.object({

// })
const getSustainGoal = TryCatch(async (req, res, next) => {
    console.log(req.user, 'user token data');
    let { data: GetAllSustainGoal, config } = await fnGet(SustainGoal, req.query || {});
    return returnResponse(res, 200, 'Successfully Get Data', GetAllSustainGoal, config)
}
)

const updateSustainGoal = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(SustainGoal, req.body, { id: req.body.id }, req)
    return returnResponse(res, 200, 'Successfully Update SustainGoal')
}
)

const deleteSustainGoal = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(SustainGoal, req.query, req, "SustainGoal_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete SustainGoal')
}
)

const postSustainGoal = TryCatch(async (req, res, next) => {
    let sustaincode = await createRandomCode(SustainGoal, 'sustaincode');
    let body = req.body;
    if (body.isNew) {
        if (body.sustaincode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            sustaincode
        }
    }
    else {
        if (!body.sustaincode) {
            return next(customErrorClass.BadRequest('SustainGoal Code Require'))
        }
    }
    await fnPost(SustainGoal, body, [], req);
    return returnResponse(res, 201, 'Successfully Added SustainGoal');
}
)
module.exports = {
    getSustainGoal,
    updateSustainGoal,
    deleteSustainGoal,
    postSustainGoal
}