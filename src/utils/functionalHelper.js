const momentjsDate = require('moment');
const moment = require('moment-timezone');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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

    // Set user id in the object

    obj.createdBy = req?.user?.userId;
    obj.updatedBy = req?.user?.userId;
    obj.lastUsedIp = req?.socket?.remoteAddress



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
    obj.deletedBy = req.user.userId;
    obj.lastUsedIp = req.socket?.remoteAddress
    return obj;
}
module.exports = {
    formatDateTime, getCurrentFormatedDate, setUserDetails, setUserDelete, ValidateEmail,
    StringtoDate
}
