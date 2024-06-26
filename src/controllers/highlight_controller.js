const customErrorClass = require("../error/customErrorClass");
const { returnResponse } = require("../helper/responseHelper");
const TryCatch = require("../utils/TryCatchHelper");
const { fnGet, fnUpdate, fnDelete, fnPost, fnbulkCreate } = require("../utils/dbCommonfn");
const { createRandomCode } = require("../utils/functionalHelper");
const { Company } = require("../Models/Company");

const { HighlightDetail } = require("../Models/HighlightDetail");
const { Highlight } = require("../Models/Highlight");
const { getEmailBody, ShootMail } = require("../utils/sendmail");
const { HighlightInterestNFavourite } = require("../Models/HighlightInterestNFavourite");
const { checkTokenForNews } = require("../middleware/verifyRequest");
const { User } = require("../Models/Users");
const { UserDetail } = require("../Models/UserDetail");

const getHighlight = TryCatch(async (req, res, next) => {
    let query = checkTokenForNews(req);
    let include = [];
    let userdetailwithhighlight = false, usersid;
    if (req.query.id) {
        include = [{
            model: HighlightDetail,
            sourceKey: "highlightid",
            foreignKey: "id",
            as: "highligthdetail"
        }]
    }

    if (query?.userid) {
        include.push({
            model: HighlightInterestNFavourite,
            sourceKey: "highlightid",
            foreignKey: "id",
            // where: { userid: query?.userid }
        })
        userdetailwithhighlight = true;
        usersid = query.userid;
        delete query.userid;
    }
    let { data: GetAllHighlight, config } = await fnGet(Highlight, query, include, false);
    if (userdetailwithhighlight && GetAllHighlight) {
        let highlightData = [];
        GetAllHighlight = GetAllHighlight.map(highlight => {
            if (highlight.HighlightInterestNFavourites.length > 0) {
                console.log(highlight.HighlightInterestNFavourites.length, 'HighlightInterestNFavourites length check');
                const HighlightInterestNFavouritearr = highlight.HighlightInterestNFavourites.filter(item => item.userid === usersid);
                // highlight.HighlightInterestNFavourites = HighlightInterestNFavouritearr.dataValues;
                // console.log(HighlightInterestNFavouritearr, 'HighlightInterestNFavourite check');
                highlightData.push({ ...highlight.dataValues, HighlightInterestNFavourites: HighlightInterestNFavouritearr.map(x => { return { ...x.dataValues } }) })
            }
            else {
                highlightData.push(highlight)
            }
            // return highlight;
        });
        GetAllHighlight = highlightData;
    }
    return returnResponse(res, 200, 'Successfully Get Highlight', GetAllHighlight, config)
}
)

const updateHighlight = TryCatch(async (req, res, next) => {
    let updateStatus = await fnUpdate(Highlight, req.body, { id: req.body.id }, req)
    if (req.body.highligthdetail && req.body.highligthdetail.lenght > 0) {
        await fnbulkCreate(HighlightDetail, req.body.highligthdetail, ['title', 'ordernumber', 'type', 'lastUsedIp', 'updatedBy'], [], req);
        // to bulk update the field to be update on db
    }
    return returnResponse(res, 200, 'Successfully Update Highlight')

}
)

const deleteHighlight = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(Highlight, req.query, req, "Highlight_" + req.query.id)
    return returnResponse(res, 200, 'Successfully Delete Highlight')
}
)

const postHighlight = TryCatch(async (req, res, next) => {
    let highlightcode = await createRandomCode(Highlight, 'highlightcode');
    let body = req.body;
    if (body.isNew) {
        if (body.highlightcode) {
            return next(customErrorClass.BadRequest('Code is not allowed on new data'))
        }
        body = {
            ...body,
            highlightcode
        }
    }
    else {
        if (!body.highlightcode) {
            return next(customErrorClass.BadRequest('Highlight Code Require'))
        }
    }
    await fnPost(Highlight, body, {
        include: ['highligthdetail']
    }, req);
    return returnResponse(res, 201, 'Successfully Added Highlight');
}
)



const postHighlightInterestnFovourite = TryCatch(async (req, res, next) => {
    let body = req.body;
    if (body?.type == 'interested' && body.email) {
        const email = {
            body: {
                name: 'John Appleseed',
                intro: 'Step to be procure during the highlight.',
                table: {
                    data: [
                        {
                            item: 'Node.js',
                            description: 'Event-driven I/O server-side JavaScript environment based on V8.',
                            price: '$10.99'
                        },
                        {
                            item: 'Mailgen',
                            description: 'Programmatically create beautiful e-mails using plain old JavaScript.',
                            price: '$1.99'
                        }
                    ],
                    columns: {
                        // Optionally, customize the column widths
                        customWidth: {
                            item: '20%',
                            price: '15%'
                        },
                        // Optionally, change column text alignment
                        customAlignment: {
                            price: 'right'
                        }
                    }
                },
                action: {
                    instructions: 'You can change the delete of interest of highlight anytime',
                    button: {
                        color: '#3869D4',
                        text: 'Go to highlight',
                        link: body.redirectionlink
                    }
                },
                outro: 'We thank you for your Interest.'
            }
        }
        let emailbody = getEmailBody(email);
        await ShootMail({ html: emailbody, recieveremail: body.email, subject: "Successfully Added Highlight to Interest" });
    }

    await fnPost(HighlightInterestNFavourite, body, [], req)
    return returnResponse(res, 201, "Successfully Created Record", {});
})

const deleteHighlightInterestnFovourite = TryCatch(async (req, res, next) => {
    if (!req.query.id) {
        next(customErrorClass.BadRequest('id required'))
    }
    await fnDelete(HighlightInterestNFavourite, req.query, req, "Highlight_" + req.query.id);
    return returnResponse(res, 200, 'Successfully Delete Record');
})

const getHighlightInterestnFovourite = TryCatch(async (req, res, next) => {
    let include = [
        {
            model: Highlight,
            sourceKey: "highlightid",
            attributes: ['id', 'eventType', 'name', 'subtype', 'imageUrl', 'provience', 'country', 'venue', 'eventdate'],
        },
        {
            model: User,
            as: "UserDetail",
            attributes: ['id', 'email', 'status', 'type', 'role', 'access_group', 'isActive'],
            include: {
                model: UserDetail,
                as: 'userdetail',
                attributes: ['id', 'firstname', 'lastname', 'img'],
            },
        }
    ];
    let query = req.query;
    if (!req.user.type == 'admin') {
        //      query
        // }
        // else {
        query = {
            ...query,
            userid: req.user.userId
        }
    }
    // if (query.id) {
    //     include = [
    //         {
    //             model: Highlight,
    //             sourceKey: "highlightid",
    //             foreignKey: "id",
    //         }
    //     ]
    // }
    let { data: GetHighlightInterestnFovourite } = await fnGet(HighlightInterestNFavourite, req.query || {}, include, false);
    return returnResponse(res, 200, 'Successfully Get Record', GetHighlightInterestnFovourite)
})


module.exports = {
    getHighlight,
    updateHighlight,
    deleteHighlight,
    postHighlight,
    postHighlightInterestnFovourite,
    deleteHighlightInterestnFovourite,
    getHighlightInterestnFovourite
}