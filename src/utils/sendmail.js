const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');
const CustomErrorObj = require("../error/CustomErrorObj");
var mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
        // Appears in header & footer of e-mails
        name: 'Asia Impact',
        link: process.env.FRONT_END_URL,
        // Optional product logo
        logo: 'https://mailgen.js/img/logo.png'
    }
});
let config = {
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSCODE
    }
}
let transporter = nodemailer.createTransport(config);


const ShootMail = (obj) => {
    let message = {
        from: process.env.MAIL,
        to: obj.recieveremail,
        subject: obj.subject,
        html: obj.html
    }
    return transporter.sendMail(message).then(() => {
        console.log('Mail Shoot');
        return true;
    }).catch((err) => {
        console.log(err, '60');
        throw new CustomErrorObj(err?.message, 500)
    })
}


const getEmailBody = (email) => {
    var emailBody = mailGenerator.generate(email);
    return emailBody;
}
module.exports = {
    ShootMail, getEmailBody
}