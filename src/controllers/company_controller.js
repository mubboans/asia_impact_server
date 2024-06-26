const { ActiveRequest } = require("../Models/ActiveRequest");
const { Company } = require("../Models/Company");
const { CompanyNSustain } = require("../Models/CompanyNSustain");
const { HighlightDetail } = require("../Models/HighlightDetail");
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
    let GetAllCompanySustain = [], include = [];
    if (req.query.id) {
        GetAllCompanySustain = await fnGet(CompanyNSustain, { companyid: req.query.id }, [
            {
                model: SustainGoal,
                sourceKey: "sustaingoalid",
                foreignKey: "id",
                order: [
                    [SustainGoal, 'id', 'DESC']
                ]
            }
        ]);
        include.push({
            model: SectionData,
            as: 'sectiondata',
            where: { reportid: null },
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
            },
            {
                model: ActiveRequest,
                sourceKey: "companyid",
            }

        )


    }
    let { data: GetAllCompany, config } = await fnGet(Company, req.query || {}, include, false);
    if (GetAllCompanySustain.length > 0 && GetAllCompanySustain.length !== 0) {
        // let GetAllCompanySustain = await fnGet(CompanyNSustain, { companyid: req.query.id }, [
        //     {
        //     model: SustainGoal,
        //     sourceKey: "sustaingoalid",
        //     foreignKey: "id",
        //     order: [
        //         [SustainGoal, 'id', 'DESC']
        //     ]
        // }
        // ]);
        // console.log(GetAllCompany, 'GetAllCompanySustain', GetAllCompanySustain);
        // GetAllCompany[0] = GetAllCompany[0]?.dataValues ? GetAllCompany[0].dataValues.sustainarr = GetAllCompanySustain : GetAllCompany[0]
        GetAllCompany[0].dataValues.sustainarr = GetAllCompanySustain;

    }
    return returnResponse(res, 200, 'Successfully Get Company', GetAllCompany, config)
}
)

const updateCompany = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Company, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    await fnbulkCreate(CompanyNSustain, req.body.sustainarr, ['companyid', 'sustaingoalid', 'lastUsedIp', 'updatedBy'], [], req); // to bulk update the field to be update on db
    await fnbulkCreate(SectionData, req.body.sectiondata, ['companyid', 'sectionname', 'key', 'value', 'lastUsedIp', 'updatedBy'], [], req)
    return returnResponse(res, 200, 'Successfully Update Company')
}
)

const deleteCompany = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    // await fnDelete(CompanyNSustain, { companyid: Number(req.query.id) }, req, "CompanySustain_" + req.query.id)
    await CompanyNSustain.destroy({ where: { companyid: Number(req.query.id) } });
    await fnDelete(Company, req.query, req, "Company_" + req.query.id);
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
            'sectiondata',
            'sustainarr'
        ],
    }, req);

    // let sustainarr = req.body?.sustainarr?.map((x) => {
    //     return {
    //         companyid: cmp.id, sustaingoalid: x
    //     }
    // })
    // if (req.body.sustainarr && req.body.sustainarr.length > 0) {
    //     await fnbulkCreate(CompanyNSustain, sustainarr, [], req);
    // }
    return returnResponse(res, 201, 'Successfully Added Company');
}
)
const deleteDetailEntries = TryCatch(async (req, res, next) => {
    let { model } = req.query;
    if (!req.query.id || !model) {
        next(customErrorClass.BadRequest('Invalid Request'))
    }
    let modelName;
    if (model == 'sustainarr') {
        modelName = CompanyNSustain
    }
    else if (model == 'sectiondata') {
        modelName = SectionData
    }
    else if (model == 'highlight') {
        modelName = HighlightDetail
    }
    delete req.query.model;
    await fnDelete(modelName, req.query, req, `${modelName}_` + req.query.id);
    return returnResponse(res, 201, 'Successfully Deleted Entry');
})
module.exports = {
    getCompany,
    updateCompany,
    deleteCompany,
    postCompany,
    deleteDetailEntries
}