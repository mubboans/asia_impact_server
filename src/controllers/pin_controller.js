const customErrorClass = require("../error/customErrorClass");
const loginReponse = require("../helper/loginResponse");
const { returnResponse } = require("../helper/responseHelper");
const { User } = require("../Models/Users");
const { fnUpdate, fnGet } = require("../utils/dbCommonfn");
const { attachedToken } = require("../utils/jwt");
const TryCatch = require("../utils/TryCatchHelper");

const set_update_Pin = TryCatch(async (req, res, next) => {
    let response = body.type == 'set' ? 'Set' : 'Update';
    await fnUpdate(User, req.body, { id: req.body.id }, req);
    return returnResponse(res, 200, `Successfully ${response} Pin`)
})

// const updatePin = TryCatch(async (req, res, next) => {

// })

const checkPin = TryCatch(async (req, res, next) => {
    let body = req.body;
    let { data: user_data_check, config } = await fnGet(User, { email: body.email }, ['userdetail'], true);
    if (!(user_data_check && user_data_check.length > 0)) {
        return next(customErrorClass.NotFound('No Detail Found'))
    }
    let d = user_data_check.length > 0;
    if (d.pin !== body.pin) {
        return next(customErrorClass.BadRequest("Pin Not Match"))
    }
    const newPayload = {
        userId: d.id, email: d.email, role: d.role, type: d.type, user, lang_id: d.lang_id, userdetail: {
            userdetailid: d.userdetail[0]?.id
        }
    };
    let tokenData = attachedToken(newPayload);
    return returnResponse(res, 200, "Login Successfully", loginReponse(d, tokenData));
})

module.exports = {
    set_update_Pin, checkPin
}