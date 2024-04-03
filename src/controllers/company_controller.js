const { Company } = require("../Models/Company");
const { CompanyNSustain } = require("../Models/CompanyNSustain");
const { SectionData } = require("../Models/SectionData");
const { SustainGoal } = require("../Models/SustainGoal");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { Op } = require('sequelize');
const getCompany = TryCatch(async (req, res, next) => {
    // if (!req?.query?.user) {
    //     req.query.targetUser = 'explorer'
    // }
    // else {
    //     req.query.targetUser = {
    //         [Op.or]: {
    //             [Op.eq]: req?.query?.user,
    //             [Op.like]: `%${req?.query?.user}%`
    //         }
    //     }
    //     delete req?.query?.user
    // }
    let GetAllCompany = await fnGet(Company, req.query || {}, [
        {
            model: SectionData,
            as: 'sectiondata'
        }
    ], false);
    if (req.query.id) {
        let GetAllCompanySustain = await fnGet(CompanyNSustain, { companyid: req.query.id }, [

            {
                model: SustainGoal,
                sourceKey: "sustaingoalid",
                foreignKey: "id",
                order: [
                    [SustainGoal, 'id', 'DESC']
                ]
            }
        ]);
        // console.log(GetAllCompanySustain, 'GetAllCompanySustain');
        GetAllCompany[0].dataValues.sustaingoaldata = GetAllCompanySustain

    }
    return returnResponse(res, 200, 'Successfully Get Company', GetAllCompany)
}
)

const updateCompany = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Company, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    await fnbulkCreate(CompanyNSustain, req.body.sustainarr, ['companyid', 'sustaingoalid', 'lastUsedIp', 'updatedBy'], req) // to bulk update the field to be update on db
    return returnResponse(res, 200, 'Successfully Update Company')

}
)

const deleteCompany = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Company, req.query, req, "Report_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Company')
}
)

const postCompany = TryCatch(async (req, res, next) => {
    let companycode = await createRandomCode(Company, 'companycode');
    let body = req.body;
    if (body.isNew) {
        if (body.companycode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            companycode
        }
    }
    else {
        if (!body.companycode) {
            return next(customErrorClass.BadRequest('Company Code Require'))
        }
    }
    let cmp = await fnPost(Company, body, {
        include: [
            'sectiondata'
        ],
    }, req);

    let sustainarr = req.body?.sustainarr?.map((x) => {
        return {
            companyid: cmp.id, sustaingoalid: x
        }
    })
    if (req.body.sustainarr && req.body.sustainarr.length > 0) {
        await fnbulkCreate(CompanyNSustain, sustainarr, [], req);
    }
    return returnResponse(res, 201, 'Successfully Added Company');
}
)

module.exports = {
    getCompany,
    updateCompany,
    deleteCompany,
    postCompany
}