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
const { fnGet, fnUpdate, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { getCurrentFormatedDate, setUserIdonQuery, createRandomCodeWithoutCheck } = require("../utils/functionalHelper");
const { Sequelize, Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const { Notification } = require("../Models/Notification");
const { Portfolio } = require("../Models/Portfolio");
const { DeviceDetail } = require("../Models/DeviceDetail");
const { Complaint } = require("../Models/Complaint");
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
    let include = [
        {
            model: UserDetail,
            sourceKey: "userid",
            as: "userdetail",
            attributes: ["id", 'firstname', "lastname", "residencecountry", "country"],

        }
    ];
    let query = getUserById(req, req?.query);

    if (req.query.id) {
        if (req.query.limit || req.query.offset) {
            next(customErrorClass.BadRequest("Invalid query with Id"))
        }
        include = [{
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
        },
        {
            model: Portfolio,
            sourceKey: "userid",
        },
        {
            model: DeviceDetail,
            sourceKey: "userid",
        },
        {
            model: Complaint,
            sourceKey: "userid",
        }
        ]

    }


    let { data, config } = await fnGet(User, { ...query, deletionDate: null }, include, false)
    if (!req.query.id) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.role == 'legalrepresent') {
                let { data: lrdetail } = await fnGet(LrDetail, { "detailtype": "company", userid: data[index].id, attribute: ['id', 'companyname'] }, [], true);
                data[index].dataValues.userdetail[0].dataValues.userlrdetail = lrdetail;
            }
            // if (element.role == 'advisor') {
            //     let { data: relationcheck } = await fnGet(UserRelation, { requestStatus: ['pending', 'approved'], advisorId: data[index].id })
            //     if (relationcheck.length > 0 && relationcheck) {
            //         data[index].dataValues.addedClient = true;
            //     } else {
            //         data[index].dataValues.addedClient = false;
            //     }
            // }
            // else if (element.role == 'legalrepresent') {
            //     let { data: lrdetail } = await fnGet(LrDetail, { "detailtype": "company", userid: data[index].id, attribute: ['id', 'companyname'] }, [], true);
            //     data[index].dataValues.userdetail[0].dataValues.userlrdetail = lrdetail;
            // }
        }
    }
    else {
        if (data[0]?.role && data[0].role == 'advisor' || data[0]?.role == 'legalrepresent' || data[0]?.role == 'individual_investor') {
            let count = await Notification.count({ where: { receiver_id: data[0].id, is_read: false } })
            console.log(count, 'countcheck');
            let query_obj = {
                requestStatus: ['pending', 'approved']
            };
            if (data[0]?.role == 'advisor') {
                query_obj.advisorId = data[0].id;
            }
            else if (data[0]?.role == 'legalrepresent' || data[0]?.role == 'individual_investor') {
                query_obj.investorId = data[0].id;
            }
            let { data: relationcheck } = await fnGet(UserRelation, query_obj, [], true)
            let approvedRelation = relationcheck.filter(x => x.requestStatus == 'approved');
            data[0].dataValues.UserRelations = approvedRelation
            if (relationcheck.length > 0 && relationcheck) {
                data[0].dataValues.addedClient = true;
            } else {
                data[0].dataValues.addedClient = false;
            }
            data[0].dataValues.notify_count = count;
        }

    }
    // if (data[0]?.role == 'advisor') {
    //     let { data: relationcheck } = await fnGet(UserRelation, { requestStatus: ['pending', 'approved'], advisorId: data[0].id })
    //     if (relationcheck.length > 0 && relationcheck) {
    //         data[0].dataValues.addedClient = true;
    //     } else {
    //         data[0].dataValues.addedClient = false;
    //     }
    // }
    // else if (data[0]?.role == 'legalrepresent' && !req.query.id) {
    //     let { data: lrdetail } = await fnGet(LrDetail, { "detailtype": "company", userid: data[0].id }, [], true);
    //     data[0].userdetail[0].userlrdetail = lrdetail;
    // }
    // let data = await Promise.all(promiseArray);

    // const structuredData = [
    //     { "users": data[0] },
    //     { "portfolio": data[1] },
    //     { "activedevice": data[2] },
    //     { "complaint": data[3] },
    // ];
    return returnResponse(res, 200, 'Successfully Get Data ', data, config)
}
)

const updateUser = TryCatch(async (req, res, next) => {
    let body = req.body;
    delete body?.password;
    delete body?.role;
    delete body?.status;
    delete body?.access_group;
    delete body?.isVerified;
    if (body?.email) {
        const { data } = await fnGet(User, { email: body.email }, [], true);
        if (data.length > 0 && req.user.userId !== data[0].id) {
            return next(new CustomErrorObj("Email already belongs to another user", 403));
        }
    }
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
    if (!req.query.id || !req.query.deletereason) {
        next(customErrorClass.BadRequest('Invalid Data'));
    }
    // let deleteStatus = await fnDelete(User, req.query, req, "UserRelation _" + req.query.id);
    let deleteStatus = await fnUpdate(User,
        {
            isActive: false,
            deletionDate: getCurrentFormatedDate(),
            status: "Deletion Request",
            deletereason: req.query.deletereason,
        }, { id: req.query.id }, req)
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

const verifyUser = TryCatch(async (req, res, next) => {
    let body = req.body;
    body.status = "approved";
    body.isVerified = true;
    if (body.document) {
        if (Array.isArray(body.document) && body.document.length > 0) {
            for (let i of body.document) {
                await fnUpdate(Document, i, { id: i.id }, req);
            }
        }
        else {
            await fnUpdate(Document, body.document, { id: body.document.id }, req);
        }
        if (body?.rejectionreason) {
            body.status = "declined";
            body.isVerified = false
        }
        await fnUpdate(User, body, { id: body.id }, req);
        return returnResponse(res, 200, 'Successfully Updated User', {});
    }

})

const getDeletedUser = TryCatch(async (req, res, next) => {
    let query = {
        deletionDate: {
            [Op.not]: null
        },
        deletereason: {
            [Op.not]: null
        },
        status: "Deletion Request"
    }
    let { data, config } = await fnGet(User, query, [], false);
    return returnResponse(res, 200, "Successfully get the Deleted User", data, config)
})

const deleteUserAdmin = TryCatch(async (req, res, next) => {
    let query = req.query;
    if (!query.id) {
        next(customErrorClass.BadRequest('Id required'))
    }
    let { data } = await fnGet(User, { id: query.id }, [
        {
            model: UserDetail,
            as: 'userdetail',
            attributes: ['id', 'firstname', 'lastname', 'img'],
        }
    ], false);
    const d = data[0];
    if (!d) return next(customErrorClass.NotFound('No user found'));
    console.log(d, 'd check');
    let urquery = {
        ...(d.role == 'advisor' && { advisorId: query.id }),
        ...(d.role == 'individual_investor' && { investorId: query.id }),
        ...(d.role == 'legalrepresent' && { investorId: query.id }),
        requestStatus: 'approved'
    }

    let { data: userrelation } = await fnGet(UserRelation, urquery, [], true);

    let rolecheck = ['individual_investor', 'advisor', 'legalrepresent']
    if (userrelation && userrelation.length > 0 && rolecheck.includes(d.role)) {
        let x = userrelation.map((x) => {
            return {
                sender_id: d.id,
                receiver_id: d.role == 'advisor' ? x.investorId : x.advisorId,
                message: `${d.userdetail[0].firstname} ${d.userdetail[0].lastname} User Account Deleted`,
                notificationcode: createRandomCodeWithoutCheck(),
                lang_id: 1,
                title: "Request for Account Delete Accepted",
                is_read: false,
                isNew: true,
                notificationtype: "message",
            }
        })
        await fnbulkCreate(Notification, x, [], [], req);
    }
    await fnUpdate(User, { status: 'Deleted', deletedBy: req.user.userId }, query, req);

    return returnResponse(res, 200, "Successfully Deleted User");
})

const freezeUser = TryCatch(async (req, res, next) => {
    let body = req?.body;
    let response = 'UnFreeze'
    body.status = 'approved'
    if (!body.isActive) {
        response = 'Freeze'
        body.status = 'freeze'
    }
    else {
        body.freezereason = null
    }
    await fnUpdate(User, body, { id: body.id }, req);
    return returnResponse(res, 200, `Successfully ${response} User`, {});
})


function getUserById(req, option) {
    // option = {
    //     ...option,
    //     // deletionDate: null
    // }
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
    ChangePassword,
    verifyUser,
    getDeletedUser,
    deleteUserAdmin,
    freezeUser,

}