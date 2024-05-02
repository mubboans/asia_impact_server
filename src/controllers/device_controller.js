const { DeviceDetail } = require("../Models/DeviceDetail");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost } = require("../utils/dbCommonfn");
const { setUserIdonQuery } = require("../utils/functionalHelper");

const getDeviceDetail = TryCatch(async (req, res, next) => {
    let query = setUserIdonQuery(req)
    let GetAllDeviceDetail = await fnGet(DeviceDetail, query, [], false);
    return returnResponse(res, 200, 'Successfully Get DeviceDetail', GetAllDeviceDetail);
}
)

const updateDeviceDetail = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(DeviceDetail, req.body, { id: req.body.id }, req)
    console.log(updateStatus, 'updateStatus');
    return returnResponse(res, 200, 'Successfully Update DeviceDetail')
}
)

const deleteDeviceDetail = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(DeviceDetail, req.query, req, "DeviceDetail" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete DeviceDetail')
}
)

const postDeviceDetail = TryCatch(async (req, res, next) => {
    let body = req.body;
    let deviceCheck = await fnGet(DeviceDetail, { userid: body.userid, deviceId: body.deviceId }, [], false);
    let responseMessage = 'Added';
    if (deviceCheck && deviceCheck.length > 0) {
        await fnUpdate(DeviceDetail, body, { userid: body.userid, deviceId: body.deviceId }, req);
        responseMessage = 'Updated';
    }
    else {
        responseMessage = 'Added';
        await fnPost(DeviceDetail, req.body, [], req);

    }
    return returnResponse(res, 201, `Successfully ${responseMessage} DeviceDetail`);
}
)


module.exports = {
    getDeviceDetail,
    updateDeviceDetail,
    deleteDeviceDetail,
    postDeviceDetail
}