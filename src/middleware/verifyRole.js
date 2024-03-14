const CustomErrorObj = require("../error/CustomErrorObj");

const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user.role) return next(new CustomErrorObj('User role not found in request', 400));
        const rolesArray = [...allowedRoles];
        console.log(rolesArray, 'rolesArray');
        console.log(req?.user.role, 'req.roles');
        const result = allowedRoles.some(role => role == req?.user.role)


        // const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return next(new CustomErrorObj('Access Denied', 403));
        next();
    }
}

module.exports = verifyRole