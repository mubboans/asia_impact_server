const Joi = require("joi");
const bcrypt = require('bcryptjs');

const CustomErrorObj = require("../error/CustomErrorObj");
const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnPost, fnUpdate } = require("../utils/dbCommonfn");
const { User } = require("../Models/Users");

const { getEmailBody, ShootMail } = require("../utils/sendmail");
const { attachedToken, validateToken } = require("../utils/jwt");
const { StringtoDate } = require("../utils/functionalHelper");
const moment = require("moment");
const { Otp } = require("../Models/Otp");
const { Sequelize } = require("sequelize");
const sendsms = require("../utils/sendsms");
const { UserDetail } = require("../Models/UserDetail");

const registerJoi = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().optional(),
    email: Joi.string().email().required(),
    contact: Joi.string().optional(),
    gender: Joi.string().optional(),
    dateofbirth: Joi.string().optional(),
    img: Joi.string().optional(),
    role: Joi.string().optional(),
    country: Joi.string().optional(),
    type: Joi.string().optional(),
    role: Joi.string().required(),
    countrycode: Joi.string().optional(),
    linkDevice: Joi.string().optional(),
    document: Joi.object().optional(),
    lang_id: Joi.number().optional(),
})
const loginJoi = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})
const OTPJoi = Joi.object({
    email: Joi.string().email().required(),
    contact: Joi.string().optional(),
    type: Joi.string().required(),
    sendby: Joi.string().optional()
})
const Login = TryCatch(async (req, res, next) => {
    let body = req.body;
    const { error } = await loginJoi.validate(body);
    if (error) {
        console.log(error);
        next(customErrorClass.BadRequest(error));
    }
    let userCheck = await fnGet(User, { email: body.email }, [
        {
            model: UserDetail,
            as: "userdetail"
        }
    ], false);
    console.log(userCheck, 'userCheck');
    if (userCheck.length > 0 && userCheck) {
        let userDetails = userCheck[0]
        // console.log(userDetails, 'userDetails');
        let hashPass = body.email + body.password;
        // console.log(hashPass, userDetails.password, 'user password');
        if (bcrypt.compareSync(hashPass, userDetails.password)) {
            const newPayload = {
                userId: userDetails.id, email: userDetails.email, role: userDetails.role,
                userdetail: {
                    userdetailid: userDetails.userdetail[0]?.id
                }
            };
            let data = attachedToken(newPayload)
            return returnResponse(res, 200, 'Login Succesfully',
                { ...data, role: userDetails.role, id: userDetails.id, email: userDetails.email, linkDevice: userDetails.linkDevice, UserDetails: userDetails.userdetail });
        }
        else {
            console.log('incorrect password');
            return next(customErrorClass.BadRequest('Credential Not Match'));
        }
        // return returnResponse(res, 200, 'Login Succesfully');
    }
    else {
        return next(customErrorClass.NotFound('No Record found'));
    }

}
)

const Register = TryCatch(async (req, res, next) => {
    let body = req.body;
    const { error } = await registerJoi.validate(body);
    if (error) {
        throw new CustomErrorObj(error?.details[0]?.message, 400)
    }
    let userCheck = await User.findOne({
        where: {
            [Sequelize.Op.or]: [
                { email: body.email },
                { contact: body.contact },
            ]
        },
        // logging: console.log,
    })
    if (userCheck) {
        return next(customErrorClass.recordExists('User Detail Already Exists'))
    }
    else {
        body.lastUsedIp = req.socket?.remoteAddress;
        if (body?.document) {
            body.document.lastUsedIp = req.socket?.remoteAddress;
        }
        let checkUserVerification = await checkUserverification(body);
        if (!checkUserVerification) {
            return next(customErrorClass.NotFound("User Not Verified"))
        }
        if (body.role == 'admin') {
            if (!body.password) {
                return next(customErrorClass.BadRequest("Password Required for admin"))
            }
        }
        body.role == 'admin' ? body.role : null;
        let user = await fnPost(User, body, {
            include: [
                'document'
            ],
        })
        delete user.dataValues.document;
        console.log(user.dataValues, 'users');
        // req.user = user.dataValues;
        const email = {
            body: {
                name: `${body.firstname} ${body.lastname}`,
                intro: 'Welcome! We\'re very excited to have you on board.',
                // action: {
                //     instructions: 'To get started with us, please Verify ',
                //     button: {
                //         color: '#22BC66', // Optional action button color
                //         text: 'Confirm your account',
                //         link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                //     }
                // },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        let emailbody = getEmailBody(email);
        await ShootMail({ html: emailbody, recieveremail: body.email, subject: "Successfully Register" });
        return returnResponse(res, 200, 'Register Succesfully');
    }

})

async function checkUserverification(body) {
    // return new Promise(async (resolve, reject) => {
    try {
        // let d = await fnGet(Otp, { email: body.email, contact: body.contact, status: 'verify' }, [], true)
        let d = await fnGet(Otp, { email: body.email, status: 'verify' }, [], true)
        console.log(d, 'otp check user');
        if (d.length > 0) {
            return true
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error, 'error occured');
        return false;
    }
    // })
}
function generateOTP() {

    // Declare a digits variable
    // which stores all digits 
    let digits = '987571920203123123';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
    // const digits = '0123456789';
    // let otp = '';

    // for (let i = 0; i < 6; i++) {
    //     const randomIndex = crypto.randomInt(0, digits.length);
    //     otp += digits.charAt(randomIndex);
    // }

    // console.log(otp, 'otp check');
}

const SendOTP = TryCatch(async (req, res, next) => {
    let body = req.body;
    const { error } = await OTPJoi.validate(body);
    if (error) {
        next(customErrorClass.BadRequest(error));
    }

    let modelobj = {
        ...body,
        otp: generateOTP(),
        validto: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        status: 'active',
    }
    if (!body.sendby || body.sendby == undefined) {
        next(customErrorClass.BadRequest('Send by required'))
    }
    let query;
    let emailbody;
    if (body.sendby == 'mail') {
        const email = {
            body: {
                title: 'OTP Verification',
                // name: `${body.firstname} ${body.lastname}`,
                intro: `Your OTP is generated for ${body.email}`,
                action: {
                    instructions: 'To get started with us, please Verify otp',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: body.type.charAt(0).toUpperCase() + body.type.slice(1),
                        // link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                    }
                },
                outro: `Your One Time Password (OTP) for ${body.type} on Asia Impact is ${modelobj.otp} which is valid for 5 minutes.`
            }
        }
        emailbody = getEmailBody(email);
        query = {
            email: body.email
        }
    }
    else {
        query = {
            contact: body.contact
        }
    }
    if (body.type == 'login' || body.type == 'forgot-password') {
        let checkUser = await fnGet(User, query, [], true)
        if (checkUser.length <= 0) {
            throw new CustomErrorObj('User not register', 404)
        }
    }
    fnGet(Otp, query, [], true).then(async (result) => {
        console.log(result, 'result check');
        if (result.length > 0) {
            if (result[0].type !== body.type) {
                fnPost(Otp, modelobj);
            }
            else {
                console.log('record found');
                fnUpdate(Otp, { ...modelobj, verifyon: null, isUsed: 0 }, query);
            }
            return returnResponse(res, 201, "Successfully send otp")
        }
        else {
            console.log('no record found');
            fnPost(Otp, modelobj);
            return returnResponse(res, 200, "Successfully send otp")
        }
    }).catch((err) => {
        console.log(err, 'err');
        return next(customErrorClass.InternalServerError("Internal Server Error"))
    });
    if (body.sendby == 'mail') {
        await ShootMail({ html: emailbody, recieveremail: body.email, subject: "One time password (OTP) for verification" });
    }
    else {
        await sendsms(body.contact, modelobj.otp);
    }
}
)
const VerifyOTP = TryCatch(async (req, res, next) => {
    let body = req.body;

    let otpData = await fnGet(Otp, { otp: body.otp, type: body.type, ...req.query }, [], true);
    if (otpData && otpData.length > 0) {
        console.log(otpData, 'otpData');
        let data = otpData[0];
        let currentDate = moment().format("YYYY-MM-DD HH:mm:ss")
        console.log(StringtoDate(data.validto), currentDate, 'date check with format');
        console.log(StringtoDate(data.validto) >= currentDate, 'condition');
        if (StringtoDate(data.validto) >= currentDate && data.status == 'active') {
            fnUpdate(Otp, { status: 'verify', verifyon: moment().format("YYYY-MM-DD HH:mm:ss") }, { id: data.id })
            if (data.type == 'login') {
                let user = await fnGet(User, { email: data.email }, [{
                    model: UserDetail,
                    as: 'userdetail'
                }], false);
                const newPayload = { userId: user[0].id, email: user[0].email, role: user[0].role };
                let tokenData = attachedToken(newPayload)
                return returnResponse(res, 200, 'Otp Verify',
                    { ...tokenData, role: user[0].role, id: user[0].id, email: user[0].email, linkDevice: user[0].linkDevice, UserDetail: user[0].userdetail });
            }
            else {
                return returnResponse(res, 200, "Otp Verify")
            }
        }
        else {
            next(customErrorClass.BadRequest('It seem your session expire'))
        }
    }
    else {
        next(customErrorClass.NotFound('Invalid Detail'))
        // return returnResponse(res, 200, "Otp No Verify")
    }
}
)

const CheckUserAvailable = TryCatch(async (req, res, next) => {
    if (!req.body.email) {
        throw new CustomErrorObj("Email Required", 400)
    }
    const user = await fnGet(User, { email: req.body.email }, [], true);
    console.log(user, 'check user');
    if (user.length > 0 && user) {
        return returnResponse(res, 200, "Request Process", { userexists: true })
    }
    else {
        return returnResponse(res, 200, "Request Process", { userexists: false })
    }
}
)

const refereshToken = TryCatch(async (req, res, next) => {
    let body = req.body;
    console.log(process.env.REFRESH_TOKEN_SECRET);
    let validateRefreshToken = validateToken(body.token, process.env.REFRESH_TOKEN_SECRET);
    if (validateRefreshToken.role && validateRefreshToken.userId) {
        delete validateRefreshToken.exp;
        delete validateRefreshToken.iat;
        console.log(validateRefreshToken, 'validateRefreshToken');
        let data = attachedToken(validateRefreshToken);
        return returnResponse(res, 200, 'Successfully Refresh Token', data);
    }
    else {
        return next(customErrorClass.InvalidToken("Referesh token Expire"));
    }
})





const ForgotPassword = TryCatch(async (req, res, next) => {
    let otpData = await fnGet(Otp, { type: 'forgot-password', email: req.body.email, status: "verify" }, [], true);
    console.log(otpData, 'otpData');
    if (otpData && otpData.length > 0) {
        let data = otpData[0];
        if (data.isUsed == 1) {
            return next(customErrorClass.BadRequest('Otp Already Used'))
        }
        let user = await User.findOne({
            where: { email: req.body.email },
        });
        if (!user) {
            next(customErrorClass.NotFound('User Not Found'))
        }
        user.password = bcrypt.hashSync(user.email + req.body.password, 10);
        // console.log(user, 'user check');
        await user.save();
        await fnUpdate(Otp, { isUsed: 1 }, { email: req.body.email });
        return returnResponse(res, 200, "Password Change Successfully")
        // }
        // else {
        //     next(customErrorClass.BadRequest('It seem your session expire'))
        // }
    }
    else {
        next(customErrorClass.NotFound('User not verify'));
    }
})

module.exports = {
    Login,
    Register,
    ForgotPassword,
    SendOTP,
    VerifyOTP,
    CheckUserAvailable,
    refereshToken,
    // documentUpload,

}
