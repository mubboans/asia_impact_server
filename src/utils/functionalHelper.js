const momentjsDate = require('moment');
const moment = require('moment-timezone');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const crypto = require("crypto");
const CustomErrorObj = require('../error/CustomErrorObj');
let role = ['admin', 'editor', 'ai_officer'];
function ValidateEmail(email) {
    if (emailRegex.test(email)) {
        return true;
    }
    else {
        return false;
    }
}

const formatDateTime = (date) => {
    console.log(date, 'date to formate');
    return moment().tz(date, process.env.TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
};
const StringtoDate = (string) => {
    return momentjsDate(string, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
}
const getCurrentFormatedDate = () => {
    console.log(momentjsDate(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    return moment(new Date()).tz(process.env.TIMEZONE).format('YYYY-MM-DD HH:mm:ss').toString();
    // return momentjsDate(new Date()).format('YYYY-MM-DD HH:mm:ss')
}


const setUserDetails = (req, obj) => {
    // Check if the user is authenticated and user data is available in req.user
    if (!req) {
        return obj;
    }
    // Set user id in the object
    // console.log(req?.user, 'users');
    obj = {
        ...obj,
        createdBy: req?.user?.userId,
        updatedBy: req?.user?.userId,
        lastUsedIp: req?.socket?.remoteAddress
    }




    // Iterate over the object properties
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'object' && !(obj.lastUsedIp || obj.updatedBy)) {
            // Recursively call the function for nested objects
            setUserDetails(req, obj[key]);
        }
    }
    return obj;
};
const setUserDetailsUpdate = (req, obj) => {
    // Check if the user is authenticated and user data is available in req.user

    // Set user id in the object
    console.log(req?.user, 'users');
    obj = {
        ...obj,
        // createdBy: req?.user?.userId,
        updatedBy: req?.user?.userId,
        lastUsedIp: req?.socket?.remoteAddress
    }




    // Iterate over the object properties
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
            // Recursively call the function for nested objects
            setUserDetails(req, obj[key]);
        }
    }
    return obj;
};
const setUserDelete = (req, obj) => {
    obj = {
        ...obj,
        deletedBy: req.user.userId,
        lastUsedIp: req.socket?.remoteAddress
    }
    // obj.deletedBy = req.user.userId;
    // obj.lastUsedIp = req.socket?.remoteAddress
    return obj;
}
async function createRandomCode(modelname, fieldname) {
    let code = crypto.randomBytes(6).toString('hex');
    // let codecheck = fieldname ? `${fieldname}:${code}` : '';
    let q = {
        [fieldname]: code
        // fieldname,: code
    }
    console.log(q, 'fieldname');
    let checkCode;
    try {

        checkCode = await modelname.findOne({
            where: q
        })
        console.log(checkCode, checkCode?.[fieldname], 'checkCode?.newcode');
        let langcode = checkCode?.[fieldname] ? crypto.randomBytes(6).toString('hex') : code;
        return langcode;
    } catch (error) {
        throw new CustomErrorObj(error?.message, 400)
    }
}

function createRandomCodeWithoutCheck() {
    let code = crypto.randomBytes(6).toString('hex');
    // let codecheck = fieldname ? `${fieldname}:${code}` : '';
    return code;
}
function setUserIdonQuery(req) {

    if (role.includes(req.user.role)) {
        return req?.query ? req?.query : {};
    }
    else {
        return {
            ...req.query,
            // userid: req.user.userId,
        }
    }

}
function setUserRoleonQuery(req) {
    if (role.includes(req.user.role)) {
        return req?.query ? req?.query : {};
    }
    else {
        return option = {
            ...option,
            role: req.user.role
        }
    }
}
function CheckUserRole(req) {
    if (role.includes(req.user.role)) {
        return true;
    }
    else {
        return false;
    }
}
module.exports = {
    formatDateTime, getCurrentFormatedDate, setUserDetails, setUserDelete, ValidateEmail,
    StringtoDate, createRandomCode, setUserDetailsUpdate,
    setUserIdonQuery, setUserRoleonQuery, createRandomCodeWithoutCheck, CheckUserRole
}
