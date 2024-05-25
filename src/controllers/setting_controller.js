const { Setting } = require("../Models/Setting");
const { UserDetail } = require("../Models/UserDetail");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuerysetting } = require("../utils/functionalHelper");

const getSetting = TryCatch(async (req, res, next) => {
    let query = setUserIdonQuerysetting(req)
    let inlcude = [
        {
            model: User,
            sourceKey: "advisorId",
            as: 'advisorUser',
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            }
        },
        {
            model: User,
            sourceKey: "investorid",
            as: 'investorUser',
            // attributes: {
            //     exclude: ['password']
            // },
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            }
        }
    ]

    let { data: GetAllSetting, config } = await fnGet(Setting, query, inlcude, false);
    return returnResponse(res, 200, 'Successfully Get Setting', GetAllSetting, config);
}
)

const updateSetting = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Setting, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Setting')
}
)

const deleteSetting = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Setting, req.query, req, "Setting" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Setting')
}
)

const postSetting = TryCatch(async (req, res, next) => {
    await fnPost(Setting, req.body, [], req);
    return returnResponse(res, 201, 'Successfully Added Setting');
}
)


module.exports = {
    getSetting,
    updateSetting,
    deleteSetting,
    postSetting
}