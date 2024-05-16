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
const loginReponse = require("../helper/loginResponse");

const registerJoi = Joi.object({
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    password: Joi.string().when('type', {
        is: 'admin',
        then: Joi.string().required().messages({
            'any.required': 'Password is to register admin'
        }),
        otherwise: Joi.string().optional()
    }),
    email: Joi.string().email().required().messages({
        'any.required': "Email required to Register"
    }),
    contact: Joi.string(),
    // userdetail: Joi.object().optional(),
    // gender: Joi.string().optional(),
    // dateofbirth: Joi.string().optional(),
    // img: Joi.string().optional(),
    role: Joi.string().required().messages({
        'any.required': "Role is Required"
    }),
    // country: Joi.string().optional(),
    type: Joi.string().required().messages({
        'any.required': "User Type is required"
    }),
    // role: Joi.string().required(),
    countrycode: Joi.string().when('contact', {
        is: Joi.string().required(), // Change to Joi.string().required() if contact is required
        then: Joi.string().required().messages({
            'any.required': "Can't proceed without country code"
        }),
        otherwise: Joi.string().forbidden().messages({
            'any.required': "Country code Not Allowed without Contact Number"
        }),
    }),
    // linkDevice: Joi.string().optional(),
    // document: Joi.object().optional(),
    lang_id: Joi.number().optional(),
})
const loginJoi = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})
const OTPJoi = Joi.object({
    email: Joi.string().email().required(),
    contact: Joi.string().when('sendby', {
        is: 'sms',
        then: Joi.string().required().messages({
            'any.required': 'Contact is required when send method is "sms"'
        }),
        otherwise: Joi.string().optional()
    }),
    type: Joi.string().required(),
    sendby: Joi.string().valid('email', 'sms').required(),
})
const Login = TryCatch(async (req, res, next) => {
    let body = req.body;
    const { error } = await loginJoi.validate(body);
    if (error) {
        console.log(error);
        next(customErrorClass.BadRequest(error));
    }
    let { data: userCheck } = await fnGet(User, { email: body.email }, [
        {
            model: UserDetail,
            as: "userdetail"
        }
    ], false);
    // console.log(userCheck, 'userCheck');
    if (userCheck.length > 0 && userCheck) {
        let userDetails = userCheck[0].dataValues;
        console.log(userDetails, 'userDetails');
        let hashPass = body.email + body.password;
        // console.log(hashPass, userDetails.password, 'user password');
        if (bcrypt.compareSync(hashPass, userDetails.password)) {
            if (!userDetails.isActive) return next(customErrorClass.AccountNotActive('It seems your account is Freeze'));
            if (userDetails.deletionDate) return next(customErrorClass.AccountDeleted('It seem your account is deleted'));
            const newPayload = {
                userId: userDetails.id, email: userDetails.email, role: userDetails.role, type: userDetails.type,
                lang_id: userDetails.lang_id,
                userdetail: {
                    userdetailid: userDetails.userdetail[0]?.id
                }
            };
            let data = attachedToken(newPayload)
            return returnResponse(res, 200, 'Login Succesfully',
                // {
                //     ...data, role: userDetails.role,
                //     id: userDetails.id,
                //     isVerified: userDetails.isVerified,
                //     rejectionreason: userDetails.rejectionreason,
                //     email: userDetails.email,
                //     linkDevice: userDetails.linkDevice,
                //     status: userDetails.status,
                //     userDetailId: userDetails.userdetail[0]?.id,
                //     userdetail: userDetails.userdetail
                // }
                loginReponse(userDetails, data)
            );
        }
        else {
            console.log('incorrect password');
            return next(customErrorClass.BadRequest('Credential Not Match'));
        }
        // return returnResponse(res, 200, 'Login Succesfully');
    }
    else {
        return next(customErrorClass.NotFound('User not found with your credentials'));
    }

}
)

const Register = TryCatch(async (req, res, next) => {
    let body = req.body;
    const { error } = await registerJoi.validate(body);
    if (error) {
        throw new CustomErrorObj(error?.details[0]?.message, 400)
    }
    let options = [
        { email: body.email }
    ]

    if (body.contact) {
        options.push({ contact: body?.contact })
    }
    let userCheck = await User.findOne({
        where: {
            [Sequelize.Op.or]: options
        },
        logging: console.log,
    })
    if (userCheck) {
        return next(customErrorClass.recordExists('User Detail Already Exists'))
    }
    else {
        body.lastUsedIp = req.socket?.remoteAddress;
        if (body?.type !== 'admin') {
            // body.document.lastUsedIp = req.socket?.remoteAddress;
            let checkUserVerification = await checkUserverification(body);
            if (!checkUserVerification) {
                return next(customErrorClass.AccountNotActive("User Not Verified"))
            }
        }
        // body.role == 'admin' ? body.role : null;
        let pstdata;
        // if (body.role == 'admin') {
        // pstdata = body
        // pstdata.isActive = true;
    }
    // else {
    pstdata = { ...body, isActive: true }
    // }
    let user = await fnPost(User, pstdata, [], req)
    console.log(user.dataValues, 'user.dataValues');


    let userdetail = await fnPost(UserDetail, { userid: user.id }, [], req);
    const newPayload = {
        userId: user.id, email: user.email, role: body.role, type: user.type, lang_id: user.lang_id,
        userdetail: {
            // userdetailid: user?.userdetail ? user?.userdetail[0]?.id : null
            userdetailid: userdetail?.id
        }
    };
    // if (!body.userdetail) {
    //     delete newPayload.userdetail;
    // }

    let data = attachedToken(newPayload);



    const email = {
        body: {
            name: `Welcome to AsiaImpact! We\'re very excited to have you on board. `,
            intro: 'We recommend to update the profile if not updated.',
            action: {
                instructions: 'To get started with us, please Verify ',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm account Dum',
                    // link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    let emailbody = getEmailBody(email);
    await ShootMail({ html: emailbody, recieveremail: body.email, subject: "Successfully Register" });
    // await Otp.update({ isUsed: 1 }, { where: { email: body.email } });
    return returnResponse(res, 201, 'Successfully Register',
        // {
        //     ...data,
        //     role: body.role,
        //     id: user.id,
        //     email: user.email,
        //     isVerified: user.isVerified,
        //     rejectionreason: user.rejectionreason,
        //     linkDevice: user.linkDevice,
        //     status: user.status,
        //     userDetailId: userdetail?.id,
        //     userdetail: [
        //         userdetail
        //     ]
        // }
        loginReponse(user, data)
    );
    // return returnResponse(res, 200, 'Register Succesfully');


})

async function checkUserverification(body) {
    // return new Promise(async (resolve, reject) => {
    try {
        // let d = await fnGet(Otp, { email: body.email, contact: body.contact, status: 'verify' }, [], true)
        let { data: d } = await fnGet(Otp, { email: body.email, status: 'verify', }, [], true)
        console.log(d, 'otp check user');
        if (d.length > 0) {
            // if (d[0].isUsed == 1) throw new CustomErrorObj('Otp already in use')
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
        return next(customErrorClass.BadRequest(error?.details[0]?.message));
    }

    let modelobj = {
        ...body,
        otp: generateOTP(),
        validto: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        status: 'active',
    }

    if (body.sendby == 'sms' && !body.contact) {
        return next(customErrorClass.BadRequest('Invalid Body'))
    }
    let query;
    let emailbody;
    if (body.sendby == 'email') {
        const email = {
            body: {
                title: 'OTP Verification',
                // name: `${body.firstname} ${body.lastname}`,
                intro: `OTP is generated for ${body.email}`,
                action: {
                    instructions: 'To get started with us, please Verify otp',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: modelobj.otp,
                        // link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                    }
                },
                outro: `Your One Time Password (OTP) for ${body.type.charAt(0).toUpperCase() + body.type.slice(1)} on Asia Impact is  valid for 5 minutes.`
            }
        }
        emailbody = getEmailBody(email);
        query = {
            email: body.email,
            type: body.type
        }
    }
    else {
        query = {
            contact: body.contact,
            type: body.type
        }
    }
    if (body.type == 'login' || body.type == 'forgot-password') {
        let { data: checkUser } = await fnGet(User, { email: body.email }, [], true)
        if (checkUser.length <= 0) {
            throw new CustomErrorObj('User not register', 404)
        }
        else if (checkUser[0].deletionDate) {
            throw new CustomErrorObj('User Deleted', 404)
        }
    }
    fnGet(Otp, query, [], true).then(async (result) => {
        console.log(result, 'result check');
        if (result.data.length > 0) {
            // if (result[0].type !== body.type) {
            //     fnPost(Otp, modelobj);
            // }
            // else {
            //     console.log('record found');
            fnUpdate(Otp, { ...modelobj, verifyon: null, isUsed: 0 }, query);
            // }

        }
        else {
            console.log('no record found');
            fnPost(Otp, modelobj);
            // return returnResponse(res, 200, "Successfully send otp")
        }
    }).catch((err) => {
        console.log(err, 'err');
        return next(customErrorClass.InternalServerError("Internal Server Error"))
    });
    if (body.sendby == 'email') {
        await ShootMail({ html: emailbody, recieveremail: body.email, subject: "One time password (OTP) for verification" });
    }
    else {
        await sendsms(body.contact, modelobj.otp);
    }
    return returnResponse(res, 201, "Successfully send otp")
}
)
const VerifyOTP = TryCatch(async (req, res, next) => {
    let body = req.body;
    if (!body.type || !body.otp) throw new CustomErrorObj("Invalid otp body", 400)
    let { data: otpData } = await fnGet(Otp, { email: body.email, type: body.type }, [], true);
    if (otpData && otpData.length > 0) {
        console.log(otpData, 'otpData');
        let data = otpData[0];
        let currentDate = moment().format("YYYY-MM-DD HH:mm:ss")
        console.log(StringtoDate(data.validto), currentDate, 'date check with format');
        console.log(StringtoDate(data.validto) >= currentDate, 'condition');
        if (data.isUsed == 1) throw new CustomErrorObj("Session Already Used", 403)
        if (data.otp !== body.otp) {
            return next(customErrorClass.BadRequest("Invalid OTP"))
        }
        if (StringtoDate(data.validto) >= currentDate && data.status == 'active') {
            if (data.type == 'login') {
                let { data: user } = await fnGet(User, { email: data.email }, [{
                    model: UserDetail,
                    as: 'userdetail'
                }], false);
                if (!user[0].isActive) {
                    return next(customErrorClass.AccountNotActive('It seems your account is Freeze'));
                }

                const newPayload = {
                    userId: user[0].id, email: user[0].email, role: user[0].role, type: user[0].type, user, lang_id: user[0].lang_id, userdetail: {
                        userdetailid: user[0].userdetail[0]?.id
                    }
                };
                let tokenData = attachedToken(newPayload);
                await fnUpdate(Otp, { status: 'verify', verifyon: moment().format("YYYY-MM-DD HH:mm:ss"), isUsed: 1 }, { id: data.id });
                return returnResponse(res, 200, 'Otp Verify',
                    loginReponse(user[0], tokenData));
            }
            else {
                await fnUpdate(Otp, { status: 'verify', verifyon: moment().format("YYYY-MM-DD HH:mm:ss"), isUsed: 1 }, { id: data.id });
                return returnResponse(res, 200, "Otp Verify")
            }
        }
        else {
            return next(customErrorClass.BadRequest('It seem your session expire'))
        }
    }
    else {
        return next(customErrorClass.NotFound('Invalid Detail'))
        // return returnResponse(res, 200, "Otp No Verify")
    }
}
)

const CheckUserAvailable = TryCatch(async (req, res, next) => {
    if (!req.body.email) {
        throw new CustomErrorObj("Email Required", 400)
    }
    const { data: user } = await fnGet(User, { email: req.body.email }, [], true);
    console.log(user, 'check user');
    if (user.length > 0 && user) {
        let userobj = user[0];
        let role = userobj.role ? userobj.role : 'basic'
        return returnResponse(res, 200, `User Already Register as ${role}`, { userexists: true })
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
    let { data: otpData } = await fnGet(Otp, { type: 'forgot-password', email: req.body.email, status: "verify" }, [], true);
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
