const route_not_found = (req, res) => {
    let responsed = {
        message: "Route you looking for does't exists",
        status: 'failed',
        success: false,
    }
    return res.status(404).send(responsed)
}

const returnResponse = (res, code, message, data = {}) => {
    return res.status(code).send({ message: message, status: code, data, success: true, status: "Success" });
}


module.exports = {
    route_not_found,
    returnResponse
}