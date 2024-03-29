let Joi = require('joi');
let joiobject = Joi.object({
    isNew: Joi.boolean().required(),
    lang_id: Joi.string().required(),
    targetUser: Joi.string().required(),
})
function validateBody(body) {

}
module.exports = validateBody