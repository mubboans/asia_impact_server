const { Report } = require("../Models/Report");
// const { CompanyNSustain } = require("../Models/CompanyNSustain");
// const { SustainGoal } = require("../Models/SustainGoal");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { Company } = require("../Models/Company");
const { Op } = require('sequelize');
const { SectionData } = require("../Models/SectionData");
const { SustainGoal } = require("../Models/SustainGoal");
const { CompanyNSustain } = require("../Models/CompanyNSustain");
const { checkTokenForNews } = require("../middleware/verifyRequest");
const getReport = TryCatch(async (req, res, next) => {
    let query = checkTokenForNews(req);
    console.log(query, 'user token data');
    // if (checkToken) {
    //     console.log('get all admin data');
    // } else {
    //     if (!req?.user?.role) {
    //         req.query.targetUser = 'basic'
    //     }
    //     else {
    //         req.query.targetUser = {
    //             [Op.or]: {
    //                 [Op.eq]: req?.user?.role,
    //                 [Op.like]: `%${req?.user?.role}%`
    //             }
    //         }

    //     }
    //     delete req?.query?.user
    // }
    let include = [];
    if (req.query.id) {
        include = [{
            model: Company,
            sourceKey: "companyid",
            foreignKey: "id",
            include: [
                {
                    model: SectionData,
                    as: 'sectiondata'
                },
                {
                    model: CompanyNSustain,
                    as: "sustainarr",
                    include: {
                        model: SustainGoal,
                        sourceKey: "sustaingoalid",
                        foreignKey: "id",
                        order: [
                            [SustainGoal, 'id', 'DESC']
                        ]
                    }
                }
            ]
        },
        {
            model: SectionData,
            as: 'sectiondata'
        }
        ]
    }
    else {
        include = [
            {
                model: Company,
                sourceKey: "companyid",
                attributes: ['id', 'name', 'companylogo', 'country'],
            }
        ]
    }
    let GetAllReport = await fnGet(Report, query, include, false);
    // if (req.query.id) {
    //     let GetAllCompanySustain = await fnGet(CompanyNSustain, { companyid: req.query.id }, [
    //         {
    //             model: SustainGoal,
    //             sourceKey: "sustaingoalid",
    //             foreignKey: "id",
    //             order: [
    //                 [SustainGoal, 'id', 'DESC']
    //             ]
    //         }
    //     ]);

    //     GetAllCompany[0].sustaingoaldata = GetAllCompanySustain
    // }
    return returnResponse(res, 200, 'Successfully Get Report', GetAllReport)
}
)

const updateReport = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Report, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    // await fnbulkCreate(CompanyNSustain, req.body.sustainarr, ['companyid', 'sustaingoalid', 'lastUsedIp', 'updatedBy'], req) // to bulk update the field to be update on db
    return returnResponse(res, 200, 'Successfully Update Report')

}
)

const deleteReport = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Report, req.query, req, "Report_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Report')
}
)

const postReport = TryCatch(async (req, res, next) => {
    let reportcode = await createRandomCode(Report, 'reportcode');
    let body = req.body;

    if (body.isNew) {
        if (body.reportcode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            reportcode
        }
    }
    else {
        if (!body.reportcode) {
            return next(customErrorClass.BadRequest('Report Code Require'))
        }
    }

    let cmp = await fnPost(Report, body, {
        include: [
            'sectiondata'
        ],
    }, req);

    // let sustainarr = req.body.sustainarr.map((x) => {
    //     return {
    //         companyid: cmp.id, sustaingoalid: x
    //     }
    // })
    // await fnbulkCreate(CompanyNSustain, sustainarr, req);
    return returnResponse(res, 201, 'Successfully Added Report');
}
)

module.exports = {
    getReport,
    updateReport,
    deleteReport,
    postReport
}