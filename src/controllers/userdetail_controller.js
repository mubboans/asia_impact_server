const { Document } = require("../Models/Document");
const { Otp } = require("../Models/Otp");
const { UserDetail } = require("../Models/UserDetail");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getUserDetail = TryCatch(async (req, res, next) => {
    let query = setUserIdonQuery(req);
    let include = [];
    if (req.query.id) {
        include.push({
            model: Document, as: "document"
        }
        )
    }
    let data = await fnGet(UserDetail, query, include, false);
    return returnResponse(res, 200, 'Successfully Get Data ', data)
}
)

const updateUserDetail = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(UserDetail, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const deleteUserDetail = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    console.log(req.query, 'req query');
    let deleteStatus = await fnDelete(UserDetail, req.query, req, "UserDetail_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete UserDetail')
}
)

const postUserDetail = TryCatch(async (req, res, next) => {
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
    console.log(include, 'include');
    await fnPost(UserDetail, req.body, include, req)
    // let userdetailUpdate = await fnPost(UserDetail, req.body, include, req);
    // if (body.documents && body.documents.length > 0) {
    //     let documentArr = body.documents.map((x) => {
    //         return {
    //             ...x,
    //             UserDetailid: UserDetail.id
    //         }
    //     });
    //     await fnbulkCreate(Document, documentArr, [], req);
    // }
    return returnResponse(res, 201, 'Successfully Added UserDetail');
}
)
const verifyDetail = TryCatch(async (req, res, next) => {
    let body = req.body;
    let checkDetailwithOtp = await fnGet(Otp, { ...body, type: 'verification', status: 'verify' }, [], false);
    if (checkDetailwithOtp && checkDetailwithOtp.length > 0) {
        await fnUpdate(User, { isVerified: true }, body, req);
        return returnResponse(res, 200, "Detail updated successfully", {});
    }
    else {
        return next(customErrorClass.BadRequest("User Veification detail not found"));
    }
})

module.exports = {
    getUserDetail,
    updateUserDetail,
    deleteUserDetail,
    postUserDetail,
    verifyDetail
}