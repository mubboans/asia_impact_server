const { Company } = require("../Models/Company");
const { Transaction } = require("../Models/Transaction");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getTransaction = TryCatch(async (req, res, next) => {
    let include = []
    if (req?.query?.id) {
        include = [
            {
                model: Company,
                sourceKey: "company_id",
            },
            {
                model: User, as: 'Buyer_Detail', sourceKey: "buyer_id", attributes: {
                    exclude: ['password']
                }, include: ['userdetail']
            },
            {
                model: User, as: 'Seller_Detail', sourceKey: 'seller_id', attributes: {
                    exclude: ['password']
                }, include: ['userdetail']
            },
        ]
    }
    let { data, config } = await fnGet(Transaction, req?.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Transaction', data, config);
}
)

const updateTransaction = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Transaction, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Transaction')
}
)

const deleteTransaction = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Transaction, req.query, req, "Transaction" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Transaction')
}
)

const postTransaction = TryCatch(async (req, res, next) => {
    await fnPost(Transaction, req.body, [], req);
    return returnResponse(res, 201, `Successfully Added Transaction`);
}
)


module.exports = {
    getTransaction,
    updateTransaction,
    deleteTransaction,
    postTransaction
}