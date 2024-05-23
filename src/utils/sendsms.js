const CustomErrorObj = require("../error/CustomErrorObj");
const requestHandler = require("./httprequest");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendSms = async (number, message) => {
    if (!number) throw new CustomErrorObj('Invalid Request');
    // let url = `${process.env.TWILLOURL}${process.env.SMS_API_KEY}/SMS/${number}/${message}/${process.env.TEMPLATENAME}`
    // var options = {
    //     method: "GET",
    //     url: url,
    //     headers: {
    //         "content-type": "application/json",
    //     },
    //     json: true,
    //     // httpsAgent: new https.Agent({ keepAlive: true }),
    //     timeout: 60000,
    // };
    // return requestHandler(options);
    return await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
        .verifications
        .create({ to: number, channel: 'sms' })
    // .then(verification => console.log(verification.sid));
}
async function verifySms(contact, code) {
    if (!contact || !code) throw new CustomErrorObj('Invalid Request');
    return await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
        .verificationChecks
        .create({ to: contact, code: code })
}
module.exports = {
    sendSms,
    verifySms
}