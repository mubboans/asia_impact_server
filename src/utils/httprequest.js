const https = require("https");
const requestHandler = async (option) => {
    try {
        console.log(option, 'option check');
        https.get(option.url, (err, res) => {
            // console.log(err, 'error');
            // console.log(res, 'res check');
        });
    } catch (error) {
        console.log(error, 'error occured in');
    }
}
module.exports = requestHandler;