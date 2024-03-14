const { UserRelation } = require("../Models/UserRelation");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { getCurrentFormatedDate } = require("../utils/functionalHelper");
const { Sequelize } = require("sequelize");
const getUser = TryCatch(async (req, res, next) => {
    console.log('hit user 10');
    let query = getUserByRole(req, req.query);
    console.log(query, 'hit user');
    let data = await fnGet(User, query || {}, [], false);
    return returnResponse(res, 200, 'Successfully Get Data ', data)
}
)

const updateUser = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(User, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const deleteUser = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    // let deleteStatus = await fnDelete(User, req.query, req, "UserRelation _" + req.query.id);
    let deleteStatus = await fnUpdate(User, { isActive: false, deletionDate: getCurrentFormatedDate() }, req.query, req)
    return returnResponse(res, 200, 'Successfully Delete User')
}
)

const postUser = TryCatch(async (req, res, next) => {
    let body = req.body;
    let userCheck = await User.findOne({
        where: {
            [Sequelize.Op.or]: [
                { email: body.email },
                { contact: body.contact },
            ]
        },
        // raw: true
        // logging: console.log,
    })
    console.log(userCheck, 'userCheck');
    // if (userCheck !== undefined || userCheck || userCheck !== null) {
    if (userCheck) {
        return next(customErrorClass.recordExists('User Detail Already Exists'))
    }
    fnPost(User, req.body, [], req);
    return returnResponse(res, 201, 'Successfully Added User');
}
)
function getUserByRole(req, option) {
    if (req.user.role == 'admin') {
        return option;
    }
    else {
        option = {
            ...option,
            role: 'explorer'
        }
    }
}
module.exports = {
    getUser,
    updateUser,
    deleteUser,
    postUser
}