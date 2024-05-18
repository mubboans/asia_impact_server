const { Company } = require("../Models/Company");
const { Portfolio } = require("../Models/Portfolio");
const { Setting } = require("../Models/Setting");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getPortfolio = TryCatch(async (req, res, next) => {
    let include = [
        {
            model: Company,
            sourceKey: "companyid",
            attributes: ['id', 'name', 'companylogo', 'country'],
        }
    ]
    if (req?.query?.id) {
        include.push(
            // {
            //     model: Company,
            //     sourceKey: "companyid",
            // },
            {
                model: User,
                sourceKey: "userid",
                attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            },
        )
    }
    if (req?.query?.investorid) {
        let { data } = await fnGet(Setting, { viewPortfolio: true, advisorId: req.user.userId, investorid: req?.query?.investorid }, [], false);
        if (!(data && data.length > 0)) {
            return next(customErrorClass.NotFound("Your Account permission not found"));
        }

        req.query = {
            ...req.query,
            userid: req.query.investorid
        }
        delete req.query.investorid;
    }
    let { data: GetAllPortfolio, config } = await fnGet(Portfolio, req?.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Portfolio', GetAllPortfolio, config);
}
)

const updatePortfolio = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Portfolio, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Portfolio')
}
)

const deletePortfolio = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Portfolio, req.query, req, "Portfolio" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Portfolio')
}
)

const postPortfolio = TryCatch(async (req, res, next) => {
    // let body = req.body;
    // let deviceCheck = await fnGet(Portfolio, { userid: body.userid, deviceId: body.deviceId }, [], false);
    // let responseMessage = 'Added';
    // if (deviceCheck && deviceCheck.length > 0) {
    //     await fnUpdate(Portfolio, body, { userid: body.userid, deviceId: body.deviceId }, req);
    //     responseMessage = 'Updated';
    // }
    // else {
    //     responseMessage = 'Added';
    // }
    await fnPost(Portfolio, req.body, [], req);

    return returnResponse(res, 201, `Successfully Added Portfolio`);
}
)


module.exports = {
    getPortfolio,
    updatePortfolio,
    deletePortfolio,
    postPortfolio
}