const { Document } = require("../Models/Document");
const { LrDetail } = require("../Models/LRDetail");
const { Otp } = require("../Models/Otp");
const { UserDetail } = require("../Models/UserDetail");
const { User } = require("../Models/Users");
const CustomErrorObj = require("../error/CustomErrorObj");
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
    // let include;
    // if (body.document) {
    let include =
    {
        include: [
            {
                model: LrDetail,
                as: 'userlrdetail',
                include: [
                    {
                        model: Document,
                        as: 'document'
                    }
                ]
            },
            {
                model: Document,
                as: 'document'
            }
        ]
    }
    // }
    // else {
    //     include = [];
    // }
    if (typeof body.user == 'object') {
        await fnUpdate(User, body.user, { id: body.userid }, req);
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

const postuserdetaildocument = TryCatch(async (req, res, next) => {
    const body = req.body;
    if (!body.userid || !body.userdetailid) {
        return next(customErrorClass.BadRequest("Id is missing"));
    }
    if (body?.email) {
        const checkuser = await fnGet(User, { email: body.email, }, [], true);
        if (checkuser.length > 0 && req.user.userId !== checkuser[0].id) {
            return next(new CustomErrorObj("Email already belongs to another user", 403));
        }
    }
    const user = { ...body };
    delete user?.password;
    delete user?.document;
    // delete user?.role;
    delete user?.status;
    delete user?.access_group;
    delete user?.isVerified;
    delete user?.lrpointofcontact;
    const promiseArr = [];


    if (body.document) {
        if (Array.isArray(body.document) && body.document.length > 0) {
            promiseArr.push(fnbulkCreate(Document, body.document, [], [], req));
        }
        else {
            promiseArr.push(fnPost(Document, body.document, [], req));
        }
    }
    if (body.lrpointofcontact) {
        promiseArr.push(fnPost(LrDetail, body.lrpointofcontact, [], req));
    }
    // Add update promises for User and UserDetail
    promiseArr.push(
        fnUpdate(User, { ...user, status: "document appproval pending" }, { id: body.userid }, req),
        fnUpdate(UserDetail, user, { id: body.userdetailid }, req)
    );

    // Execute all promises in parallel
    await Promise.all(promiseArr);

    return returnResponse(res, 200, 'User details updated and document inserted successfully');
});

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
    verifyDetail,
    postuserdetaildocument
}