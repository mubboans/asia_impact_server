const CustomErrorObj = require("../error/CustomErrorObj");
const requestHandler = require("./httprequest");

function sendsms(number, message) {
    if (!number || !message) throw new CustomErrorObj('Invalid Request');
    let url = `${process.env.TWILLOURL}${process.env.SMS_API_KEY}/SMS/${number}/${message}/${process.env.TEMPLATENAME}`
    var options = {
        method: "GET",
        url: url,
        headers: {
            "content-type": "application/json",
        },
        json: true,
        // httpsAgent: new https.Agent({ keepAlive: true }),
        timeout: 60000,
    };
    return requestHandler(options);
}
module.exports = sendsms