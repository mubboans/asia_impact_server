const { City } = require("../Models/City");
const { Country } = require("../Models/Country");
const { Region } = require("../Models/Region");

const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getCountry = TryCatch(async (req, res, next) => {
    // let query = setUserIdonQuery(req)
    let query = req.query;
    let { data: GetAllCountry, config } = await fnGet(Country, query, [{
        model: Region,
        as: 'region',
        include: [{
            model: City,
            as: 'city'
        }]
    }], false);
    return returnResponse(res, 200, 'Successfully Get Country', GetAllCountry, config);
}
)

const updateCountry = TryCatch(async (req, res, next) => {
    await fnUpdate(Country, req.body, { id: req.body.id }, req)
    let promiseArr = [];
    if (req.body.region && req.body.region.length > 0) {
        const region = req.body.region;
        for (let index = 0; index < region.length; index++) {
            const element = region[index];
            if (element.id) {
                promiseArr.push(fnUpdate(Region, { regionname: element.regionname }, { id: element.id }, req))
                let city = element?.city;
                if (city && city.length > 0) {
                    for (let index = 0; index < city.length; index++) {
                        const d = city[index];
                        if (d.id) {
                            promiseArr.push(fnUpdate(City, { cityname: d.cityname }, { id: d.id }));
                        }
                        else {
                            promiseArr.push(fnPost(City, d, [], req))
                        }
                    }
                }
            }
            else {
                promiseArr.push(fnPost(Region, element, { include: ['city'] }, req))
            }
        }
    }
    await Promise.all(promiseArr);
    return returnResponse(res, 200, 'Successfully Update Country')
}
)

const deleteCountry = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Country, req.query, req, "Country" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Country')
}
)

const postCountry = TryCatch(async (req, res, next) => {
    let body = req.body;
    await fnPost(Country, req.body, {
        include: [{
            model: Region,
            as: 'region',
            include: [{
                model: City,
                as: 'city'
            }]
        }]
    }, req);
    return returnResponse(res, 201, `Successfully Added Country`);
}
)


module.exports = {
    getCountry,
    updateCountry,
    deleteCountry,
    postCountry
}