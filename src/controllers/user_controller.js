const { UserRelation } = require("../Models/UserRelation");
const { User } = require("../Models/Users");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");

const getUserWithRelation = TryCatch(async (req, res, next) => {
    console.log('hit user 8');
    let d = setUserId(req);
    console.log('hit user 10');
    let query = {
        ...req.query,
        ...d
    }
    let include = [{
        model: User,
        sourceKey: "investorId",
        foreignKey: "id",
    },
    {
        model: User,
        sourceKey: "advisorId",
        foreignKey: "id",
    }
    ]
    console.log(query, 'hit user');
    let data = await fnGet(UserRelation, req.query || {}, include);
    return returnResponse(res, 200, 'Successfully Get Data ', data)
}
)

const updateRelation = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(UserRelation, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update Data')
}
)

const deleteRelation = TryCatch(async (req, res, next) => {
    if (!req.query) {
        next(customErrorClass.BadRequest('id required'))
    }
    let deleteStatus = await fnDelete(UserRelation, req.query, req, "UserRelation _" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete UserRelation')
}
)

const postRelation = TryCatch(async (req, res, next) => {
    console.log('post news');
    fnPost(UserRelation, req.body, [], req);
    return returnResponse(res, 201, 'Successfully Added UserRelation');
}
)
function setUserId(req) {
    let d;
    switch (req.user.role) {
        case 'advisor':
            d = {
                advisorId: req.user.userId,
                relationshipType: 0
            }
            break;
        case 'investor':
            d = {
                investorId: req.user.userId,
                relationshipType: 1
            }
            break;
    }
    return d;
}
// function setInclude(req){
//     let d=[];
//     switch (req.user.role) {
//         case 'advisor':
//           d.push(,  
//           )
//             break;
//         case 'investor':
//             d = {
//                 investorId: req.user.userId,
//                 relationshipType:1
//           }  
//             break;
//     }

// }
module.exports = {
    getUserWithRelation,
    updateRelation,
    deleteRelation,
    postRelation
}