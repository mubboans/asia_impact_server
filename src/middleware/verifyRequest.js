const { DeviceDetail } = require("../Models/DeviceDetail");
const CustomErrorObj = require("../error/CustomErrorObj");
const customErrorClass = require("../error/customErrorClass");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet } = require("../utils/dbCommonfn");
const { validateToken } = require("../utils/jwt");
const { Op } = require('sequelize')
let role = ['admin', 'editor', 'ai_officer'];
const checkToken = TryCatch(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    console.log(req.url, 'url check');
    if (req.url.includes('/auth')) {
        return next()
    }
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        return next(customErrorClass.Unauthorized("Please Provide Token"));
    }
    try {
        console.log('hit before head');
        const head = validateToken(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(head, 'head check');
        req.user = head;
        if ((head.role || head.email) && head.userId) {
            console.log(req.user);
            next();
            // let tokenDeviceChecked = await fnGet(DeviceDetail, { token }, [], true);
            // if (tokenDeviceChecked && tokenDeviceChecked.length > 0) {
            //     next();
            // }
            // else {
            //     /* This code snippet is checking if the role of the user extracted from the token
            //     (`req.user.role`) is included in the `role` array which contains the roles 'admin',
            //     'editor', and 'ai_officer'.We don't check the token from cms admin */
            //     if (role.includes(head.role)) {
            //         next()
            //     }
            //     return next(customErrorClass.StaticResponseWithAlldata({
            //         code: 403,
            //         message: "Token Removed",
            //         success: false,
            //         error: "Device Token Remove",
            //         status: "Failed"
            //     }));
            // }
        }
        else {
            return next(customErrorClass.InvalidToken("Token is invalid"));
        }

    } catch (error) {
        return next(customErrorClass.Unauthorized(error?.message ? error?.message : "Unauthorized"));
    }
}
)
const checkTokenForNews = (req) => {
    const authHeader = req.headers.authorization;
    let token;
    let query;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        query = {
            ...req.query,
            targetUser: 'basic',
        }
    }
    else {
        try {
            const head = validateToken(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(head, 'head check');
            if ((head.role || head.email) && head.userId) {
                if (role.includes(head.role)) {
                    query = { ...req?.query, ...(req?.query?.addhome == '1' && { addhome: true }) } || {};
                }
                else {
                    query = {
                        ...req?.query,
                        // targetUser: {
                        [Op.or]: [
                            {
                                targetUser: {
                                    [Op.eq]: head.role
                                }
                            },
                            {
                                targetUser: {
                                    [Op.like]: `%${head.role}%`
                                }
                            },
                            {
                                targetUser: {
                                    [Op.like]: 'basic,%'
                                }
                            },
                            {
                                targetUser: {
                                    [Op.like]: '%,basic'
                                }
                            },
                            {
                                targetUser: {
                                    [Op.eq]: 'basic'
                                }
                            },
                            {
                                targetUser: {
                                    [Op.eq]: 'individual_investor'
                                }
                            },
                            {
                                targetUser: {
                                    [Op.like]: 'individual_investor,%'
                                }
                            },
                            {
                                targetUser: {
                                    [Op.like]: '%,individual_investor'
                                }
                            }
                        ],
                        // access_group: head.access_group,
                        // [Op.in]: [
                        //     // { targetUser: { [Op.eq]: head.role } },
                        //     { targetUser: { [Op.like]: `%${head.role}%` } },
                        //     { targetUser: { [Op.eq]: 'basic' } }
                        // ],
                        // },
                        userid: head.userId,
                        ...(req?.query?.addhome == '1' && { addhome: true })
                    }
                }
            }
            else {
                return next(customErrorClass.InvalidToken("Token is invalid pass"));
            }
        }
        catch (error) {
            query = {
                targetUser: 'basic'
            }
            throw new CustomErrorObj(error?.message == 'invalid signature' ? 'Invalid Token' : error?.message, 403);
        }
    }
    return query;
}
module.exports = { checkToken, checkTokenForNews }