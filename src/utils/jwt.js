const jwt = require('jsonwebtoken');
const CustomErrorObj = require('../error/CustomErrorObj');

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

function validateToken(token, secret) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error('Invalid token:', error.message);
        throw new CustomErrorObj(error.message, 403);
    }
}


function attachedToken(payload) {
    let d = {
        accesstoken: generateAccessToken(payload),
        refreshtoken: generateRefreshToken(payload)
    }
    return d
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    validateToken,
    attachedToken
}