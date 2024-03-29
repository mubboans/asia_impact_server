class customErrorClass {
    constructor(code, message, success, error, status) {
        this.code = code,
            this.message = message,
            this.success = success,
            this.error = error,
            this.status = status
    }

    static BadRequest(error) {
        return new customErrorClass(400, "Bad request", false, error, 'Failed');
    }
    static InternalServerError(error) {
        return new customErrorClass(500, "Internal server error", false, error, 'Failed');
    }
    static NotFound(error) {
        return new customErrorClass(404, "Record not found", false, error, 'Failed');
    }
    static recordExists(error) {
        return new customErrorClass(409, "Record Already Exist", false, error, 'Failed');
    }
    static InvalidToken(error) {
        return new customErrorClass(403, "Token is invalid", false, error, 'Failed');
    }
    static Unauthorized(error) {
        return new customErrorClass(401, "User failed to authenticate", false, error, 'Failed');
    }
    static ToManyRequest(error) {
        return new customErrorClass(429, 'Too many requests. Please try again later.', false, error, 'Failed');
    }
    static AccountNotActive(error) {
        return new customErrorClass(403, "Account Not Active", false, error, 'Failed');
    }
}
module.exports = customErrorClass