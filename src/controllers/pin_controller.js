const customErrorClass = require("../error/customErrorClass");
const loginReponse = require("../helper/loginResponse");
const { returnResponse } = require("../helper/responseHelper");
const { User } = require("../Models/Users");
const { fnUpdate, fnGet } = require("../utils/dbCommonfn");
const { attachedToken } = require("../utils/jwt");
const TryCatch = require("../utils/TryCatchHelper");

const set_update_Pin = TryCatch(async (req, res, next) => {

    let response = req.body.type == 'set' ? 'Set' : 'Update';
    // if(body.type == 'set'){
    //     await fnUpdate(User, req.body, { id: req.body.id }, req);  
    // }
    // else if(body.type == 'update'){
    //     await fnUpdate(User, req.body, { id: req.body.id }, req);

    // }
    await fnUpdate(User, { pin: req.body.pin }, { id: req.body.id }, req);
    return returnResponse(res, 200, `Successfully ${response} Pin`)
})

// const updatePin = TryCatch(async (req, res, next) => {

// })

const checkPin = TryCatch(async (req, res, next) => {
    let body = req.body;
    let { data: user_data_check, config } = await fnGet(User, { id: body.id }, ['userdetail'], false);
    if (!(user_data_check && user_data_check.length > 0)) {
        return next(customErrorClass.NotFound('No Detail Found'))
    }
    let d = user_data_check[0];
    if (parseInt(d.pin) !== body.pin) {
        return next(customErrorClass.BadRequest("Pin Not Match"))
    }
    const newPayload = {
        userId: d.id,
        access_group: d.access_group,
        email: d.email, role: d.role, type: d.type, d, lang_id: d.lang_id, userdetail: {
            userdetailid: d.userdetail[0]?.id
        }
    };
    let tokenData = attachedToken(newPayload);
    return returnResponse(res, 200, "Login Successfully", loginReponse(d, tokenData));
})

module.exports = {
    set_update_Pin, checkPin
}