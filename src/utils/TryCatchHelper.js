const CustomErrorObj = require("../error/CustomErrorObj");


const TryCatch = (func) => {
    return (req, res, next) => {
        return Promise.resolve(func(req, res, next)).catch((e) => {
            console.log(e, 'error throw from trycatch ');
            // apiErrorHandlerClass.BadRequest(e)
            if (e && e instanceof CustomErrorObj) {
                return next(new CustomErrorObj(e?.message, e?.code));
                // throw new CustomErrorObj(e?.message, e?.code);
            }
            else {
                return next(new CustomErrorObj(e?.message, 503));
            }
            // next(new Error(e?.message))
        });
    }
}

module.exports = TryCatch