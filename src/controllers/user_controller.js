const Joi = require("joi");
const { Document } = require("../Models/Document");
const { LrDetail } = require("../Models/LRDetail");
const { UserDetail } = require("../Models/UserDetail");
const { UserRelation } = require("../Models/UserRelation");
const { User } = require("../Models/Users");
const CustomErrorObj = require("../error/CustomErrorObj");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnPost } = require("../utils/dbCommonfn");
const { getCurrentFormatedDate, setUserIdonQuery } = require("../utils/functionalHelper");
const { Sequelize } = require("sequelize");
const bcrypt = require('bcryptjs');
let passJoi = Joi.object({
    email: Joi.string().required(),
    password: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8}$/)
        .message('Password must be 8 characters long and contain at least one number and one special symbol')
})
let addUser = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().optional(),
    contact: Joi.string().optional(),
    isVerified: Joi.string().optional(),
    countrycode: Joi.string().optional(),
    type: Joi.string().optional(),
    isActive: Joi.string().optional(),
    lang_id: Joi.string().optional(),
    role: Joi.string().valid('basic', 'intermediate', 'advanced', 'individual_investor', 'advisor', 'legalrepresent', 'admin', 'editor', 'ai_officer'),
    type: Joi.string().valid('admin', 'user'),
    userdetail: Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        img: Joi.string().optional(),
        residencecountry: Joi.string().optional(),
        country: Joi.string().optional(),
        zipcode: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional(),
        housenumber: Joi.string().optional(),
        gender: Joi.string().optional(),
        dateofbirth: Joi.string().optional(),
        linkDevice: Joi.string().optional(),
        lang_id: Joi.string().optional(),
        document: Joi.object().optional(),
    }),
})
const getUser = TryCatch(async (req, res, next) => {
    let include = [];
    let query = getUserById(req, req?.query);

    console.log(query, 'hit user');
    if (req.query.id) {
        if (req.query.limit || req.query.offset) {
            next(customErrorClass.BadRequest("Invalid query with Id"))
        }
        include.push({
            model: UserDetail,
            include: [
                {
                    model: LrDetail,
                    sourceKey: "userdetailid",
                    foreignKey: "id",
                    as: "userlrdetail",
                    include: {
                        model: Document,
                        sourceKey: "lrdetailid",
                        foreignKey: "id",
                        as: 'document'
                    }
                },
                {
                    model: Document,
                    sourceKey: "userdetailid",
                    foreignKey: "id",
                    as: 'document'
                }
            ],
            sourceKey: "userid",
            foreignKey: "id",
            as: "userdetail"
        })
    }
    let data = await fnGet(User, query, include, false);
    return returnResponse(res, 200, 'Successfully Get Data ', data)
}
)

const updateUser = TryCatch(async (req, res, next) => {
    delete req?.body?.password;
    let updateStatus = await fnUpdate(User, req.body, { id: req.body.id }, req)
    if (req.body?.userdetail) {
        await fnUpdate(UserDetail, req?.body?.userdetail, { userid: req.body.id }, req)
    }
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const ChangePassword = TryCatch(async (req, res, next) => {
    let body = req.body;
    const { error } = await passJoi.validate(body);
    if (error) {
        return next(customErrorClass.BadRequest(error?.details[0]?.message));
    }
    body.password = bcrypt.hashSync(body.email + body.password, 10);
    let user = await fnUpdate(User, body, { email: body.email }, req);
    return returnResponse(res, 200, 'Successfully Change Password')
})

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
    let include;
    const { error } = await addUser.validate(body);
    if (error) {
        return next(customErrorClass.BadRequest(error?.details[0]?.message));
    }

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
    // if (body.userdetail) {
    include = {
        include: [
            {
                model: UserDetail,
                as: 'userdetail',
                include: [
                    {
                        model: Document,
                        as: 'document'
                    }
                ]
            }
        ]
    }

    let d = await fnPost(User, body, include, req);
    return returnResponse(res, 201, 'Successfully Added User');
}
)


function getUserById(req, option) {
    option = {
        ...option,
        deletionDate: null
    }
    if (req.user.role == 'admin') {
        return option;
    }
    else {
        if (!req.query.id) {
            if (!req.query.role) {
                throw new CustomErrorObj('Role or Id required', 400)
            }
        }
        if (req.user.type == 'user' && req.query.role == 'admin') throw new CustomErrorObj("Can't Get Admin", 400)
        return option = {
            ...option,
        }
    }
}
module.exports = {
    getUser,
    updateUser,
    deleteUser,
    postUser,
    ChangePassword
}