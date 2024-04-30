const customErrorClass = require("../error/customErrorClass");
const TryCatch = require("../utils/TryCatchHelper");
const { validateToken } = require("../utils/jwt");
const { Op } = require('sequelize')

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
    // try{ 

    try {
        console.log('hit before head');
        const head = validateToken(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(head, 'head check');
        req.user = head;
        if ((head.role || head.email) && head.userId) {
            console.log(req.user);
            next();
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
            if (head.role && (head.role == 'admin' || head.role == 'editor' || head.role == 'ai_officer')) {
                query = req?.query || {};
            }
            else {
                query = {
                    ...req?.query,
                    targetUser: {
                        [Op.or]: {
                            [Op.eq]: head.role,
                            [Op.like]: `%${head.role}%`
                        }
                    }
                }
            }
        } catch (error) {
            query = {
                targetUser: 'basic'
            }
        }
    }
    return query;
}
module.exports = { checkToken, checkTokenForNews }