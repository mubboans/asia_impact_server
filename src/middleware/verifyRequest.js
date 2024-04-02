const customErrorClass = require("../error/customErrorClass");
const TryCatch = require("../utils/TryCatchHelper");
const { validateToken } = require("../utils/jwt");

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
        if (head.role && head.userId) {
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

module.exports = checkToken